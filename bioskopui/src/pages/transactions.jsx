import React, { Component } from "react";
import { connect } from "react-redux";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import { Navigate } from "react-router-dom";
import { FaCreditCard, FaClock, FaUser, FaCalendar, FaFilm, FaEye, FaDownload, FaCheck, FaTimes, FaFilter, FaSearch, FaFilePdf } from "react-icons/fa";
import Numeral from "numeral";
import { generateReceiptPDF } from "../utils/pdfGenerator";

class Transactions extends Component {
  state = {
    transactions: [],
    filteredTransactions: [],
    loading: true,
    error: null,
    selectedTransaction: null,
    showDetailModal: false,
    filterStatus: 'all', // all, paid, pending
    searchTerm: '',
    dateFilter: 'all' // all, today, week, month
  };

  componentDidMount() {
    this.fetchTransactions();
  }

  fetchTransactions = () => {
    this.setState({ loading: true });

    // Fetch only paid orders (transactions)
    Axios.get(`${APIURL}orders?userId=${this.props.UserId}&bayar=true`)
      .then(res => {
        const transactions = res.data;

        // Fetch movie data and order details for each transaction
        const promises = transactions.map(transaction => {
          const moviePromise = Axios.get(`${APIURL}movies/${transaction.movieId}`)
            .then(movieRes => movieRes.data)
            .catch(err => {
              console.error(`Error fetching movie ${transaction.movieId}:`, err);
              return null; // Return null if movie not found
            });

          const detailsPromise = Axios.get(`${APIURL}ordersDetails?orderId=${transaction.id}`)
            .then(detailRes => detailRes.data)
            .catch(err => {
              console.error(`Error fetching transaction details for ${transaction.id}:`, err);
              return []; // Return empty array if details not found
            });

          return Promise.all([moviePromise, detailsPromise])
            .then(([movie, orderDetails]) => ({
              ...transaction,
              movie: movie,
              orderDetails: orderDetails
            }));
        });

        Promise.all(promises)
          .then(transactionsWithDetails => {
            const sortedTransactions = transactionsWithDetails.sort((a, b) =>
              new Date(b.orderDate || b.id) - new Date(a.orderDate || a.id)
            );
            this.setState({
              transactions: sortedTransactions,
              filteredTransactions: sortedTransactions,
              loading: false
            });
          })
          .catch(err => {
            console.error('Error processing transactions:', err);
            this.setState({
              transactions: transactions,
              filteredTransactions: transactions,
              loading: false
            });
          });
      })
      .catch(err => {
        console.error('Error fetching transactions:', err);
        this.setState({
          error: 'Failed to load transactions',
          loading: false
        });
      });
  };

  applyFilters = () => {
    const { transactions, filterStatus, searchTerm, dateFilter } = this.state;
    let filtered = [...transactions];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(transaction => 
        (transaction.movie?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id.toString().includes(searchTerm)
      );
    }

    // Filter by date
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.orderDate || transaction.id);
        
        switch (dateFilter) {
          case 'today':
            return transactionDate >= today;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return transactionDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return transactionDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    this.setState({ filteredTransactions: filtered });
  };

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value }, this.applyFilters);
  };

  handleFilterChange = (filterType, value) => {
    this.setState({ [filterType]: value }, this.applyFilters);
  };

  showTransactionDetail = (transaction) => {
    this.setState({ 
      selectedTransaction: transaction,
      showDetailModal: true 
    });
  };

  closeDetailModal = () => {
    this.setState({
      selectedTransaction: null,
      showDetailModal: false
    });
  };

  downloadReceipt = async (transaction) => {
    try {
      await generateReceiptPDF(transaction);
    } catch (error) {
      console.error('Error generating PDF receipt:', error);
      // Fallback to text download if PDF generation fails
      this.downloadTextReceipt(transaction);
    }
  };

  downloadTextReceipt = (transaction) => {
    const movie = transaction.movie || {};
    const orderDetails = transaction.orderDetails || [];
    const seats = orderDetails.map(seat =>
      `${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[seat.row]}${seat.seat + 1}`
    ).join(', ');

    // Create receipt content
    const receiptContent = `
BIOSKOP SANDRA CINEMA
======================
PAYMENT RECEIPT
======================

Transaction ID: #${transaction.id}
Date: ${transaction.orderDate ? new Date(transaction.orderDate).toLocaleString() : 'N/A'}

MOVIE DETAILS:
--------------
Title: ${movie.title || 'N/A'}
Genre: ${movie.genre || 'N/A'}
Duration: ${movie.durasi || 'N/A'} minutes
Showtime: ${transaction.jadwal}:00

CUSTOMER INFORMATION:
--------------------
Name: ${transaction.customerName || 'N/A'}
Email: ${transaction.customerEmail || 'N/A'}
Phone: ${transaction.customerPhone || 'N/A'}

BOOKING DETAILS:
---------------
Seats: ${seats}
Number of Tickets: ${orderDetails.length}
Price per Ticket: ${Numeral(25000).format("Rp0,0")}

PAYMENT INFORMATION:
-------------------
Payment Method: ${transaction.paymentMethod === 'credit_card' ? 'Credit Card' :
                 transaction.paymentMethod === 'bank_transfer' ? 'Bank Transfer' :
                 transaction.paymentMethod || 'N/A'}
Status: PAID ✓

TOTAL AMOUNT: ${Numeral(transaction.totalharga || 0).format("Rp0,0")}

======================
Thank you for your payment!
This receipt serves as proof of purchase.
Please keep this for your records.

Bioskop Sandra Cinema
Contact: info@bioskopsandra.com
======================
    `.trim();

    // Create and download file
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BioskopSandra_Receipt_${transaction.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  getPaymentMethodBadge = (method) => {
    const colors = {
      credit_card: 'bg-blue-100 text-blue-800',
      bank_transfer: 'bg-green-100 text-green-800',
      default: 'bg-gray-100 text-gray-800'
    };
    
    const color = colors[method] || colors.default;
    const displayName = method === 'credit_card' ? 'Credit Card' : 
                      method === 'bank_transfer' ? 'Bank Transfer' : 
                      method || 'Unknown';
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        <FaCreditCard className="mr-1" />
        {displayName}
      </span>
    );
  };

  calculateTotalRevenue = () => {
    return this.state.filteredTransactions.reduce((total, transaction) => 
      total + (transaction.totalharga || transaction.totalHarga || 0), 0
    );
  };

  renderTransactionCard = (transaction) => {
    const movie = transaction.movie || {};
    const seatCount = transaction.orderDetails ? transaction.orderDetails.length : 0;
    
    return (
      <div key={transaction.id} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              {movie.image && (
                <img 
                  src={movie.image} 
                  alt={movie.title}
                  className="w-16 h-24 object-cover rounded-md"
                />
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {movie.title || 'Movie not found'}
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FaCalendar className="mr-2 text-blue-500" />
                    Transaction #{transaction.id}
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-2 text-green-500" />
                    Showtime: {transaction.jadwal}:00
                  </div>
                  <div className="flex items-center">
                    <FaUser className="mr-2 text-purple-500" />
                    {transaction.customerName || 'Customer'}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="mb-2">
                {this.getPaymentMethodBadge(transaction.paymentMethod)}
              </div>
              <div className="text-lg font-bold text-green-600">
                {Numeral(transaction.totalharga || transaction.totalHarga || 0).format("Rp0,0")}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {seatCount} ticket(s)
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {transaction.orderDate ? new Date(transaction.orderDate).toLocaleString() : 'Date not available'}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => this.downloadReceipt(transaction)}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                title="Download PDF Receipt"
              >
                <FaFilePdf className="mr-1" />
                PDF
              </button>
              <button
                onClick={() => this.showTransactionDetail(transaction)}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <FaEye className="mr-1" />
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderDetailModal = () => {
    const { selectedTransaction, showDetailModal } = this.state;
    if (!showDetailModal || !selectedTransaction) return null;

    const movie = selectedTransaction.movie || {};
    const orderDetails = selectedTransaction.orderDetails || [];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-green-600 text-white p-6 rounded-t-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Transaction Details</h3>
              <button
                onClick={this.closeDetailModal}
                className="text-white hover:text-gray-200 text-xl"
              >
                <FaTimes />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {/* Transaction Status */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <FaCheck className="text-green-600 mr-2" />
                <span className="font-semibold text-green-800">Payment Successful</span>
              </div>
            </div>

            {/* Movie Info */}
            <div className="flex items-start space-x-4 mb-6">
              {movie.image && (
                <img 
                  src={movie.image} 
                  alt={movie.title}
                  className="w-24 h-36 object-cover rounded-md"
                />
              )}
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-900 mb-2">{movie.title}</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FaFilm className="mr-2 text-blue-500" />
                    Genre: {movie.genre || 'N/A'}
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-2 text-green-500" />
                    Duration: {movie.durasi || 'N/A'} minutes
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <h5 className="font-semibold text-gray-900">Transaction Information</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium">#{selectedTransaction.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Showtime:</span>
                    <span className="font-medium">{selectedTransaction.jadwal}:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    {this.getPaymentMethodBadge(selectedTransaction.paymentMethod)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction Date:</span>
                    <span className="font-medium">
                      {selectedTransaction.orderDate ? new Date(selectedTransaction.orderDate).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-semibold text-gray-900">Customer Information</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{selectedTransaction.customerName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selectedTransaction.customerEmail || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{selectedTransaction.customerPhone || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seats */}
            <div className="mb-6">
              <h5 className="font-semibold text-gray-900 mb-3">Purchased Seats</h5>
              <div className="flex flex-wrap gap-2">
                {orderDetails.map((seat, index) => (
                  <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[seat.row]}{seat.seat + 1}
                  </span>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Paid:</span>
                <span className="text-2xl font-bold text-green-600">
                  {Numeral(selectedTransaction.totalharga || selectedTransaction.totalHarga || 0).format("Rp0,0")}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={this.closeDetailModal}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => this.downloadReceipt(selectedTransaction)}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaFilePdf className="inline mr-2" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    if (!this.props.AuthLog) {
      return <Navigate to="/login" replace />;
    }

    const { filteredTransactions, loading, error, searchTerm, dateFilter } = this.state;
    const totalRevenue = this.calculateTotalRevenue();

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              <FaCreditCard className="inline mr-3 text-green-600" />
              Transaction History
            </h1>
            <p className="text-gray-600">View your completed movie ticket purchases</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {filteredTransactions.length}
              </div>
              <div className="text-gray-600">Total Transactions</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {Numeral(totalRevenue).format("Rp0,0")}
              </div>
              <div className="text-gray-600">Total Spent</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {filteredTransactions.reduce((total, t) => total + (t.orderDetails?.length || 0), 0)}
              </div>
              <div className="text-gray-600">Total Tickets</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaSearch className="inline mr-2" />
                  Search Transactions
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={this.handleSearchChange}
                  placeholder="Search by movie, customer, or transaction ID..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaFilter className="inline mr-2" />
                  Filter by Date
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => this.handleFilterChange('dateFilter', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your transactions...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <FaCreditCard className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No transactions found</h3>
              <p className="text-gray-500 mb-6">You haven't completed any movie ticket purchases yet.</p>
              <a 
                href="/"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaFilm className="mr-2" />
                Browse Movies
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredTransactions.map(transaction => this.renderTransactionCard(transaction))}
            </div>
          )}

          {/* Detail Modal */}
          {this.renderDetailModal()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  AuthLog: state.Auth.login,
  UserId: state.Auth.id
});

export default connect(mapStateToProps)(Transactions);
