import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import Numeral from "numeral";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { FaClock, FaTicketAlt, FaCreditCard, FaMapMarkerAlt, FaTimes, FaCheck, FaUser, FaCalendar, FaFilm } from "react-icons/fa";
import Swal from "sweetalert2";

const BuyTicket = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState({});
  const [totalSeats, setTotalSeats] = useState(0);
  const [rowCount, setRowCount] = useState(0);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState(
    location.state && location.state.jadwal && location.state.jadwal.length > 0
      ? location.state.jadwal[0]
      : 12
  );
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [orderStep, setOrderStep] = useState(1);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const onTimeChange = () => {
    setLoading(true);
    setSelectedSeats([]); // Set loading true when time changes
    const studioId = location.state.studioId;
    const movieId = location.state.id;

    Axios.get(`${APIURL}/studios/${studioId}`)
      .then(res1 => {
        Axios.get(`${APIURL}/orders?movieId=${movieId}&jadwal=${selectedTime}`)
          .then(res2 => {
            const orderPromises = res2.data.map(val => Axios.get(`${APIURL}/ordersDetails?orderId=${val.id}`));
            Axios.all(orderPromises)
              .then(res3 => {
                const bookedSeatData = res3.flatMap(val => val.data);
                setMovieData(location.state);
                setTotalSeats(res1.data.jumlahKursi);
                setRowCount(res1.data.jumlahKursi / 20); // Assuming 20 seats per row
                setBookedSeats(bookedSeatData);
                setLoading(false);
              })
              .catch(err => {
                console.log(err);
                setLoading(false);
              });
          })
          .catch(err2 => {
            console.log(err2);
            setLoading(false);
          });
      })
      .catch(err1 => {
                 // console.log(err);
             // console.log(err2);
         // console.log(err1);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (location.state) {
      onTimeChange();
    } else {
      setLoading(false); // No location state, stop loading
    }
  }, []);

  useEffect(() => {
    // If selectedTime changes, fetch new seat data
    if (location.state) {
      onTimeChange();
    }
  }, [selectedTime]);

  const onTimeButtonClick = val => {
    setSelectedTime(val); // Let useEffect handle onTimeChange call
  };

  const onSelectSeatClick = (row, seat) => {
    const newSelectedSeats = [...selectedSeats, { row, seat }];
    setSelectedSeats(newSelectedSeats);
  };

  const onCancelSeatClick = (row, seat) => {
    const newSelectedSeats = selectedSeats.filter(val => !(val.row === row && val.seat === seat));
    setSelectedSeats(newSelectedSeats);
  };

  // Enhanced order process
  const onOrderClick = () => {
    if (selectedSeats.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Seats Selected',
        text: 'Please select at least one seat to continue.',
      });
      return;
    }
    setOrderStep(2);
  };

  const handleCustomerInfoSubmit = () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Information',
        text: 'Please fill in all customer information fields.',
      });
      return;
    }
    setOrderStep(3);
  };

  const handlePaymentSubmit = () => {
    setProcessingPayment(true);

    // Simulate payment processing
    setTimeout(() => {
      processOrder();
    }, 2000);
  };

  const processOrder = () => {
    const { UserId } = props;
    const totalPrice = selectedSeats.length * 25000;

    const orderData = {
      userId: UserId,
      movieId: movieData.id,
      totalharga: totalPrice,
      jadwal: selectedTime,
      bayar: true, // Set to true since payment is processed
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      paymentMethod: paymentMethod,
      orderDate: new Date().toISOString(),
      status: 'confirmed'
    };

    Axios.post(`${APIURL}/orders`, orderData)
      .then(res => {
        const newOrderId = res.data.id;
        const orderDetailsData = selectedSeats.map(val => ({
          orderId: newOrderId,
          seat: val.seat,
          row: val.row
        }));

        const postDetailsPromises = orderDetailsData.map(val => Axios.post(`${APIURL}/ordersDetails`, val));
        Axios.all(postDetailsPromises)
          .then(() => {
            setProcessingPayment(false);
            setOrderSuccess(true);
            setOrderId(newOrderId);
            setOrderStep(4);
          })
          .catch(err => {
            console.error('Error creating order details:', err);
            setProcessingPayment(false);
            Swal.fire({
              icon: 'error',
              title: 'Order Failed',
              text: 'Something went wrong. Please try again.',
            });
          });
      })
      .catch(err => {
        console.error('Error creating order:', err);
        setProcessingPayment(false);
        Swal.fire({
          icon: 'error',
          title: 'Order Failed',
          text: 'Something went wrong. Please try again.',
        });
      });
  };

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo({
      ...customerInfo,
      [field]: value
    });
  };

  const goBackToStep = (step) => {
    setOrderStep(step);
  };

  const resetOrder = () => {
    setSelectedSeats([]);
    setOrderStep(1);
    setCustomerInfo({ name: '', email: '', phone: '' });
    setPaymentMethod('credit_card');
    setOrderSuccess(false);
    setOrderId(null);
  };

  const renderPrice = () => {
    const ticketCount = selectedSeats.length;
    const totalPrice = ticketCount * 25000;
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">
            {ticketCount} ticket(s) × {Numeral(25000).format("Rp0,0")}
          </span>
          <span className="text-xl font-bold text-blue-600">
            {Numeral(totalPrice).format("Rp0,0")}
          </span>
        </div>
      </div>
    );
  };

  const renderSeats = () => {
    if (rowCount === 0) return null;

    const seatsPerRow = totalSeats / rowCount;
    let seatMatrix = Array(rowCount).fill(null).map(() => Array(seatsPerRow).fill(1));

    bookedSeats.forEach(val => {
      if (val.row < rowCount && val.seat < seatsPerRow) seatMatrix[val.row][val.seat] = 3;
    });
    selectedSeats.forEach(val => {
      if (val.row < rowCount && val.seat < seatsPerRow) seatMatrix[val.row][val.seat] = 2;
    });

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="text-center mb-6">
          <div className="bg-gray-800 text-white py-2 px-8 rounded-lg inline-block mb-4">
            <FaFilm className="inline mr-2" />
            SCREEN
          </div>
        </div>
        <div className="mb-6">
          {seatMatrix.map((rowSeats, rowIndex) => (
            <div key={rowIndex} className="flex justify-center mb-2">
              {rowSeats.map((seatStatus, seatIndex) => {
                let seatClass = "bg-gray-200 hover:bg-gray-300 text-gray-700 border-2 border-gray-300";
                let disabled = false;
                let onClickHandler = () => onSelectSeatClick(rowIndex, seatIndex);

                if (seatStatus === 2) { // Selected
                  seatClass = "bg-green-500 text-white hover:bg-green-600 border-2 border-green-600";
                  onClickHandler = () => onCancelSeatClick(rowIndex, seatIndex);
                } else if (seatStatus === 3) { // Booked
                  seatClass = "bg-red-500 text-white cursor-not-allowed border-2 border-red-600";
                  disabled = true;
                }

                return (
                  <button
                    key={seatIndex}
                    className={`w-10 h-10 m-1 rounded-lg text-xs font-semibold transition-all duration-200 transform hover:scale-105 ${seatClass}`}
                    disabled={disabled}
                    onClick={onClickHandler}
                  >
                    {alphabet[rowIndex]}{seatIndex + 1}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Seat Legend */}
        <div className="flex justify-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 border-2 border-gray-300 rounded mr-2"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 border-2 border-green-600 rounded mr-2"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 border-2 border-red-600 rounded mr-2"></div>
            <span>Booked</span>
          </div>
        </div>
      </div>
    );
  };
  
  const renderTimeButtons = () => {
    if (!movieData.jadwal) return null;
    return (
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {movieData.jadwal.map((val) => (
          <button
            key={val}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
              selectedTime === val
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50"
            }`}
            onClick={() => onTimeButtonClick(val)}
            disabled={loading && selectedTime !== val}
          >
            <FaClock className="inline mr-2" />
            {val}:00
          </button>
        ))}
      </div>
    );
  };

  const handleTicketPurchaseSuccess = () => {
    // Instead of window.location.reload(), redirect to home or another appropriate page
    setRedirectToHome(true);
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, title: 'Select Seats', icon: FaTicketAlt },
      { number: 2, title: 'Customer Info', icon: FaUser },
      { number: 3, title: 'Payment', icon: FaCreditCard },
      { number: 4, title: 'Confirmation', icon: FaCheck }
    ];

    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = orderStep === step.number;
            const isCompleted = orderStep > step.number;

            return (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  isCompleted ? 'bg-green-500 border-green-500 text-white' :
                  isActive ? 'bg-blue-600 border-blue-600 text-white' :
                  'bg-gray-200 border-gray-300 text-gray-500'
                }`}>
                  <Icon className="text-lg" />
                </div>
                <div className="ml-2 hidden sm:block">
                  <div className={`text-sm font-semibold ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-500' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-4 ${
                    orderStep > step.number ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCustomerInfoStep = () => {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Customer Information</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={customerInfo.name}
              onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={customerInfo.email}
              onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => goBackToStep(1)}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleCustomerInfoSubmit}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  const renderPaymentStep = () => {
    const totalAmount = selectedSeats.length * 25000;

    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Payment Method</h3>

        <div className="space-y-4 mb-6">
          <div
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              paymentMethod === 'credit_card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onClick={() => setPaymentMethod('credit_card')}
          >
            <div className="flex items-center">
              <FaCreditCard className="text-blue-600 mr-3" />
              <div>
                <div className="font-semibold">Credit Card</div>
                <div className="text-sm text-gray-600">Visa, Mastercard, etc.</div>
              </div>
            </div>
          </div>

          <div
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              paymentMethod === 'bank_transfer' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onClick={() => setPaymentMethod('bank_transfer')}
          >
            <div className="flex items-center">
              <FaCreditCard className="text-green-600 mr-3" />
              <div>
                <div className="font-semibold">Bank Transfer</div>
                <div className="text-sm text-gray-600">Direct bank transfer</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Amount:</span>
            <span className="text-xl font-bold text-blue-600">
              {Numeral(totalAmount).format("Rp0,0")}
            </span>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => goBackToStep(2)}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            disabled={processingPayment}
          >
            Back
          </button>
          <button
            onClick={handlePaymentSubmit}
            disabled={processingPayment}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {processingPayment ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              'Pay Now'
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderConfirmationStep = () => {
    const totalAmount = selectedSeats.length * 25000;

    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheck className="text-white text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
          <p className="text-gray-600">Your tickets have been booked successfully.</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-semibold">#{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Movie:</span>
              <span className="font-semibold">{movieData.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Showtime:</span>
              <span className="font-semibold">{selectedTime}:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Seats:</span>
              <span className="font-semibold">
                {selectedSeats.map(seat =>
                  `${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[seat.row]}${seat.seat + 1}`
                ).join(', ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Customer:</span>
              <span className="font-semibold">{customerInfo.name}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600">Total:</span>
              <span className="font-bold text-green-600">
                {Numeral(totalAmount).format("Rp0,0")}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setRedirectToHome(true)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
          <button
            onClick={resetOrder}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Book Another Ticket
          </button>
        </div>
      </div>
    );
  };

  if (!location.state || !props.AuthLog) {
    return <Navigate to="/login" replace />;
  }
  if (redirectToHome) {
    return <Navigate to="/" replace />;
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Book Your Tickets
            </h1>
            <p className="text-gray-600">Select your seats and complete your booking</p>
          </div>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Movie Info */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-center space-x-4">
              <FaFilm className="text-blue-600 text-2xl" />
              <h2 className="text-2xl font-bold text-gray-900">{movieData.title}</h2>
            </div>
            {orderStep === 1 && (
              <div className="mt-4 text-center">
                <p className="text-gray-600 mb-4">Select your preferred showtime:</p>
                {loading && selectedSeats.length === 0 ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  renderTimeButtons()
                )}
              </div>
            )}
          </div>

          {/* Step Content */}
          {orderStep === 1 && (
            <div>
              {/* Seat Selection */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading seats...</p>
                </div>
              ) : (
                renderSeats()
              )}

              {/* Price Summary and Continue Button */}
              {selectedSeats.length > 0 && (
                <div className="mt-8 max-w-md mx-auto">
                  {renderPrice()}
                  <button
                    onClick={onOrderClick}
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
                  >
                    <FaTicketAlt className="inline mr-2" />
                    Continue to Customer Info
                  </button>
                </div>
              )}
            </div>
          )}

          {orderStep === 2 && renderCustomerInfoStep()}
          {orderStep === 3 && renderPaymentStep()}
          {orderStep === 4 && renderConfirmationStep()}
        </div>
      </div>
    );
};

const MapstateToprops = state => {
  return {
    AuthLog: state.Auth.login,
    UserId: state.Auth.id
  };
};
export default connect(MapstateToprops)(BuyTicket);
