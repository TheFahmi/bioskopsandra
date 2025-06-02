import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import { Navigate } from "react-router-dom";
import { FaTicketAlt, FaClock, FaUser, FaCalendar, FaFilm, FaEye, FaDownload, FaCheck, FaTimes, FaFilePdf } from "react-icons/fa";
import Numeral from "numeral";
import { generateTicketPDF } from "../utils/pdfGenerator";

const Orders = (props) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);

    Axios.get(`${APIURL}orders?userId=${props.UserId}`)
      .then(res => {
        const ordersData = res.data;

        // Fetch movie data and order details for each order
        const promises = ordersData.map(order => {
          const moviePromise = Axios.get(`${APIURL}movies/${order.movieId}`)
            .then(movieRes => movieRes.data)
            .catch(err => {
              console.error(`Error fetching movie ${order.movieId}:`, err);
              return null; // Return null if movie not found
            });

          const detailsPromise = Axios.get(`${APIURL}ordersDetails?orderId=${order.id}`)
            .then(detailRes => detailRes.data)
            .catch(err => {
              console.error(`Error fetching order details for ${order.id}:`, err);
              return []; // Return empty array if details not found
            });

          return Promise.all([moviePromise, detailsPromise])
            .then(([movie, orderDetails]) => ({
              ...order,
              movie: movie,
              orderDetails: orderDetails
            }));
        });

        Promise.all(promises)
          .then(ordersWithDetails => {
            setOrders(ordersWithDetails.sort((a, b) => new Date(b.orderDate || b.id) - new Date(a.orderDate || a.id)));
            setLoading(false);
          })
          .catch(err => {
            console.error('Error processing orders:', err);
            setOrders(ordersData);
            setLoading(false);
          });
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
        setLoading(false);
      });
  };

  const showOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedOrder(null);
    setShowDetailModal(false);
  };

  const downloadTicket = async (order) => {
    try {
      await generateTicketPDF(order);
    } catch (error) {
      console.error('Error generating PDF ticket:', error);
      // Fallback to text download if PDF generation fails
      downloadTextTicket(order);
    }
  };

  const downloadTextTicket = (order) => {
    const movie = order.movie || {};
    const orderDetails = order.orderDetails || [];
    const seats = orderDetails.map(seat =>
      `${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[seat.row]}${seat.seat + 1}`
    ).join(', ');

    // Create ticket content
    const ticketContent = `
BIOSKOP SANDRA CINEMA
======================
MOVIE TICKET
======================

Order ID: #${order.id}
Movie: ${movie.title || 'N/A'}
Genre: ${movie.genre || 'N/A'}
Duration: ${movie.durasi || 'N/A'} minutes

Showtime: ${order.jadwal}:00
Seats: ${seats}
Customer: ${order.customerName || 'N/A'}

Total: ${Numeral(order.totalharga || 0).format("Rp0,0")}
Status: ${order.bayar ? 'PAID' : 'PENDING'}

Order Date: ${order.orderDate ? new Date(order.orderDate).toLocaleString() : 'N/A'}

======================
Thank you for choosing Bioskop Sandra!
Please arrive 15 minutes before showtime.
======================
    `.trim();

    // Create and download file
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BioskopSandra_Ticket_${order.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (order) => {
    if (order.bayar) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <FaCheck className="mr-1" />
          Paid
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <FaClock className="mr-1" />
          Pending
        </span>
      );
    }
  };

  const renderOrderCard = (order) => {
    const movie = order.movie || {};
    const seatCount = order.orderDetails ? order.orderDetails.length : 0;

    return (
      <div key={order.id} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
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
                  {movie && movie.title ? movie.title : `Movie ID ${order.movieId} (Not Found)`}
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FaCalendar className="mr-2 text-blue-500" />
                    Order #{order.id}
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-2 text-green-500" />
                    Showtime: {order.jadwal}:00
                  </div>
                  <div className="flex items-center">
                    <FaTicketAlt className="mr-2 text-purple-500" />
                    {seatCount} ticket(s)
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              {getStatusBadge(order)}
              <div className="mt-2 text-lg font-bold text-gray-900">
                {Numeral(order.totalharga || order.totalHarga || 0).format("Rp0,0")}
              </div>
            </div>
          </div>
          
          {order.customerName && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center text-sm text-gray-600">
                <FaUser className="mr-2" />
                <span className="font-medium">Customer:</span>
                <span className="ml-1">{order.customerName}</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Date not available'}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => downloadTicket(order)}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                title="Download PDF Ticket"
              >
                <FaFilePdf className="mr-1" />
                PDF
              </button>
              <button
                onClick={() => showOrderDetail(order)}
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

  const renderDetailModal = () => {
    if (!showDetailModal || !selectedOrder) return null;

    const movie = selectedOrder.movie || {};
    const orderDetails = selectedOrder.orderDetails || [];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-blue-600 text-white p-6 rounded-t-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Order Details</h3>
              <button
                onClick={closeDetailModal}
                className="text-white hover:text-gray-200 text-xl"
              >
                <FaTimes />
              </button>
            </div>
          </div>
          
          <div className="p-6">
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

            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <h5 className="font-semibold text-gray-900">Order Information</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">#{selectedOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Showtime:</span>
                    <span className="font-medium">{selectedOrder.jadwal}:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    {getStatusBadge(selectedOrder)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium">
                      {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {selectedOrder.customerName && (
                <div className="space-y-3">
                  <h5 className="font-semibold text-gray-900">Customer Information</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedOrder.customerEmail || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{selectedOrder.customerPhone || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment:</span>
                      <span className="font-medium">{selectedOrder.paymentMethod || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Seats */}
            <div className="mb-6">
              <h5 className="font-semibold text-gray-900 mb-3">Selected Seats</h5>
              <div className="flex flex-wrap gap-2">
                {orderDetails.map((seat, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[seat.row]}{seat.seat + 1}
                  </span>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {Numeral(selectedOrder.totalharga || selectedOrder.totalHarga || 0).format("Rp0,0")}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={closeDetailModal}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => downloadTicket(selectedOrder)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
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

  if (!props.AuthLog) {
    return <Navigate to="/login" replace />;
  }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              <FaTicketAlt className="inline mr-3 text-blue-600" />
              My Orders
            </h1>
            <p className="text-gray-600">View and manage your movie ticket orders</p>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your orders...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <FaTicketAlt className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders found</h3>
              <p className="text-gray-500 mb-6">You haven't made any movie ticket orders yet.</p>
              <a 
                href="/"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaFilm className="mr-2" />
                Browse Movies
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => renderOrderCard(order))}
            </div>
          )}

          {/* Detail Modal */}
          {renderDetailModal()}
        </div>
      </div>
    );
};

const mapStateToProps = state => ({
  AuthLog: state.Auth.login,
  UserId: state.Auth.id
});

export default connect(mapStateToProps)(Orders);
