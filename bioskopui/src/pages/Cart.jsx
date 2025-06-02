import React, { useState, useEffect } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { APIURL } from "./../support/ApiUrl";
import { FaTrash, FaEye, FaShoppingCart, FaCreditCard, FaTicketAlt } from "react-icons/fa";
import Swal from "sweetalert2";

const Cart = (props) => {
  const [cartData, setCartData] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailIndex, setDetailIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    Axios.get(`${APIURL}orders?userId=${props.UserId}&bayar=false`)
      .then(res => {
        const cartDataResponse = res.data;

        // Fetch movie details and order details for each order
        const promises = cartDataResponse.map(order => {
          const moviePromise = Axios.get(`${APIURL}movies/${order.movieId}`);
          const qtyPromise = Axios.get(`${APIURL}ordersDetails?orderId=${order.id}`);
          return Promise.all([moviePromise, qtyPromise]);
        });

        Promise.all(promises)
          .then(results => {
            const finalData = cartDataResponse.map((order, index) => ({
              ...order,
              movie: results[index][0].data, // Movie data
              qty: results[index][1].data    // Order details data
            }));
            setCartData(finalData);
          })
          .catch(err => {
            console.error("Error fetching movie or order details:", err);
            // Set cartData with orders but without movie details
            setCartData(cartDataResponse);
          });
      })
      .catch(err => {
        console.error("Error fetching orders:", err);
        setCartData([]);
      });
  }, [props.UserId]);

  const handleCheckout = () => {
    if (!cartData || cartData.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Cart Empty',
        text: 'Your cart is empty. Add some tickets first!',
      });
      return;
    }

    Swal.fire({
      title: 'Confirm Checkout',
      text: 'Are you sure you want to proceed with checkout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Checkout!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        processCheckout();
      }
    });
  };

  const processCheckout = () => {
    setCheckoutLoading(true);

    // Update all orders to bayar: true
    const updatePromises = cartData.map(order =>
      Axios.patch(`${APIURL}orders/${order.id}`, { bayar: true })
    );

    Promise.all(updatePromises)
      .then(() => {
        setCheckoutLoading(false);
        setCartData([]);
        Swal.fire({
          icon: 'success',
          title: 'Checkout Successful!',
          text: 'Your tickets have been purchased successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      })
      .catch(err => {
        console.error('Checkout error:', err);
        setCheckoutLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Checkout Failed',
          text: 'Something went wrong. Please try again.',
        });
      });
  };

  const handleDeleteItem = (orderId, index) => {
    Swal.fire({
      title: 'Delete Item',
      text: 'Are you sure you want to remove this item from cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Delete order and its details
        Promise.all([
          Axios.delete(`${APIURL}orders/${orderId}`),
          Axios.get(`${APIURL}ordersDetails?orderId=${orderId}`)
            .then(res => {
              const deletePromises = res.data.map(detail =>
                Axios.delete(`${APIURL}ordersDetails/${detail.id}`)
              );
              return Promise.all(deletePromises);
            })
        ])
        .then(() => {
          const newCartData = [...cartData];
          newCartData.splice(index, 1);
          setCartData(newCartData);
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Item has been removed from cart.',
            timer: 1500,
            showConfirmButton: false
          });
        })
        .catch(err => {
          console.error('Delete error:', err);
          Swal.fire({
            icon: 'error',
            title: 'Delete Failed',
            text: 'Something went wrong. Please try again.',
          });
        });
      }
    });
  };

  const calculateTotal = () => {
    if (!cartData) return 0;
    return cartData.reduce((total, item) => {
      const price = item.totalHarga || item.totalharga || 0;
      return total + price;
    }, 0);
  };

  const renderCartItems = () => {
    if (!cartData) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading cart data...</span>
        </div>
      );
    }

    if (cartData.length === 0) {
      return (
        <div className="text-center py-12">
          <FaShoppingCart className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
          <p className="text-gray-500">Add some movie tickets to get started!</p>
        </div>
      );
    }

    return cartData.map((item, index) => {
      const price = item.totalHarga || item.totalharga || 0;
      return (
        <div key={item.id} className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex-1">
              <div className="flex items-start space-x-4">
                {item.movie && item.movie.image && (
                  <img
                    src={item.movie.image}
                    alt={item.movie.title}
                    className="w-16 h-24 object-cover rounded-md shadow-sm"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {item.movie ? item.movie.title : 'Movie not found'}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center">
                      <FaTicketAlt className="mr-2 text-blue-500" />
                      Schedule: {item.jadwal}:00
                    </p>
                    <p className="flex items-center">
                      <span className="mr-2">🎫</span>
                      Seats: {item.qty ? item.qty.length : 0} tickets
                    </p>
                    <p className="flex items-center font-semibold text-green-600">
                      <span className="mr-2">💰</span>
                      Rp {price.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <button
                onClick={() => { setShowDetailModal(true); setDetailIndex(index); }}
                className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm"
              >
                <FaEye className="mr-1" />
                Details
              </button>
              <button
                onClick={() => handleDeleteItem(item.id, index)}
                className="flex items-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 text-sm"
              >
                <FaTrash className="mr-1" />
                Remove
              </button>
            </div>
          </div>
        </div>
      );
    });
  };

  const currentCartItem = cartData && cartData.length > 0 ? cartData[detailIndex] : null;
  const totalAmount = calculateTotal();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              <FaShoppingCart className="inline-block mr-3 text-blue-600" />
              Your Cart
            </h1>
            <p className="text-gray-600">Review your selected movie tickets</p>
          </div>

          {/* Detail Modal */}
          {showDetailModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-hidden">
                <div className="bg-blue-600 text-white p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      Seat Details - {currentCartItem && currentCartItem.movie ? currentCartItem.movie.title : 'Movie not found'}
                    </h3>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="text-white hover:text-gray-200 text-xl"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="p-4 max-h-64 overflow-y-auto">
                  {currentCartItem && currentCartItem.qty ? (
                    <div className="space-y-2">
                      {currentCartItem.qty.map((seatDetail, seatIndex) => (
                        <div key={seatIndex} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium">Seat {seatIndex + 1}</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[seatDetail.row]}{seatDetail.seat + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No seat details available.</p>
                  )}
                </div>
                <div className="p-4 border-t">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cart Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Cart Items</h2>
                {renderCartItems()}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                {cartData && cartData.length > 0 ? (
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Items ({cartData.length})</span>
                        <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Service Fee</span>
                        <span>Rp 0</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                      <span>Total</span>
                      <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
                    </div>

                    <button
                      onClick={handleCheckout}
                      disabled={checkoutLoading}
                      className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                        checkoutLoading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105'
                      }`}
                    >
                      {checkoutLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <FaCreditCard className="mr-2" />
                          Proceed to Checkout
                        </div>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <p>No items in cart</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

const MapStateToProps = state => {
  return {
    // AuthLog: state.Auth.login, // AuthLog not used in component
    UserId: state.Auth.id
  };
};

export default connect(MapStateToProps)(Cart);
