import React, { Component } from "react";
import { connect } from "react-redux";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import Numeral from "numeral";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { FaClock, FaTicketAlt, FaCreditCard, FaMapMarkerAlt, FaTimes, FaCheck, FaUser, FaCalendar, FaFilm } from "react-icons/fa";
import Swal from "sweetalert2";

class Belitiket extends Component {
  state = {
    datamovie: {},
    seats: 0,
    baris: 0,
    booked: [],
    loading: true,
    jam: this.props.location.state && this.props.location.state.jadwal && this.props.location.state.jadwal.length > 0
         ? this.props.location.state.jadwal[0]
         : 12,
    pilihan: [],
    openmodalcart: false,
    redirecthome: false,
    // New states for enhanced features
    showPaymentModal: false,
    paymentMethod: 'credit_card',
    customerInfo: {
      name: '',
      email: '',
      phone: ''
    },
    orderStep: 1, // 1: Select Seats, 2: Customer Info, 3: Payment, 4: Confirmation
    processingPayment: false,
    orderSuccess: false,
    orderId: null
  };

  componentDidMount() {
    if (this.props.location.state) {
      this.onJamchange();
    } else {
      this.setState({ loading: false }); // No location state, stop loading
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // If jam changes, fetch new seat data
    if (prevState.jam !== this.state.jam) {
      this.onJamchange();
    }
  }
  
  onJamchange = () => {
    this.setState({ loading: true, pilihan: [] }); // Set loading true when jam changes
    const studioId = this.props.location.state.studioId;
    const movieId = this.props.location.state.id;

    Axios.get(`${APIURL}studios/${studioId}`)
      .then(res1 => {
        Axios.get(`${APIURL}orders?movieId=${movieId}&jadwal=${this.state.jam}`)
          .then(res2 => {
            const arrAxios = res2.data.map(val => Axios.get(`${APIURL}ordersDetails?orderId=${val.id}`));
            Axios.all(arrAxios)
              .then(res3 => {
                const arrAxios2 = res3.flatMap(val => val.data);
                this.setState({
                  datamovie: this.props.location.state,
                  seats: res1.data.jumlahKursi,
                  baris: res1.data.jumlahKursi / 20, // Assuming 20 seats per row
                  booked: arrAxios2,
                  loading: false
                });
              })
              .catch(err => {
                console.log(err);
                this.setState({ loading: false });
              });
          })
          .catch(err2 => {
            console.log(err2);
            this.setState({ loading: false });
          });
      })
      .catch(err1 => {
                 // console.log(err);
             // console.log(err2);
         // console.log(err1);
        this.setState({ loading: false });
      });
  };

  onButtonjamclick = val => {
    this.setState({ jam: val }); // Let CDU handle onJamChange call
  };

  onPilihSeatClick = (row, seat) => {
    const pilihan = [...this.state.pilihan, { row, seat }];
    this.setState({ pilihan });
  };

  onCancelseatClick = (row, seat) => {
    const pilihan = this.state.pilihan.filter(val => !(val.row === row && val.seat === seat));
    this.setState({ pilihan });
  };

  // Enhanced order process
  onOrderClick = () => {
    if (this.state.pilihan.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Seats Selected',
        text: 'Please select at least one seat to continue.',
      });
      return;
    }
    this.setState({ orderStep: 2 });
  };

  handleCustomerInfoSubmit = () => {
    const { customerInfo } = this.state;
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Information',
        text: 'Please fill in all customer information fields.',
      });
      return;
    }
    this.setState({ orderStep: 3 });
  };

  handlePaymentSubmit = () => {
    this.setState({ processingPayment: true });

    // Simulate payment processing
    setTimeout(() => {
      this.processOrder();
    }, 2000);
  };

  processOrder = () => {
    const { UserId } = this.props;
    const { datamovie, pilihan, jam, customerInfo, paymentMethod } = this.state;
    const totalharga = pilihan.length * 25000;

    const dataorders = {
      userId: UserId,
      movieId: datamovie.id,
      totalharga,
      jadwal: jam,
      bayar: true, // Set to true since payment is processed
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      paymentMethod: paymentMethod,
      orderDate: new Date().toISOString(),
      status: 'confirmed'
    };

    Axios.post(`${APIURL}orders`, dataorders)
      .then(res => {
        const orderId = res.data.id;
        const dataordersdetails = pilihan.map(val => ({
          orderId,
          seat: val.seat,
          row: val.row
        }));

        const postDetailsPromises = dataordersdetails.map(val => Axios.post(`${APIURL}ordersDetails`, val));
        Axios.all(postDetailsPromises)
          .then(() => {
            this.setState({
              processingPayment: false,
              orderSuccess: true,
              orderId: orderId,
              orderStep: 4
            });
          })
          .catch(err => {
            console.error('Error creating order details:', err);
            this.setState({ processingPayment: false });
            Swal.fire({
              icon: 'error',
              title: 'Order Failed',
              text: 'Something went wrong. Please try again.',
            });
          });
      })
      .catch(err => {
        console.error('Error creating order:', err);
        this.setState({ processingPayment: false });
        Swal.fire({
          icon: 'error',
          title: 'Order Failed',
          text: 'Something went wrong. Please try again.',
        });
      });
  };

  handleCustomerInfoChange = (field, value) => {
    this.setState({
      customerInfo: {
        ...this.state.customerInfo,
        [field]: value
      }
    });
  };

  goBackToStep = (step) => {
    this.setState({ orderStep: step });
  };

  resetOrder = () => {
    this.setState({
      pilihan: [],
      orderStep: 1,
      customerInfo: { name: '', email: '', phone: '' },
      paymentMethod: 'credit_card',
      orderSuccess: false,
      orderId: null
    });
  };

  renderHarga = () => {
    const jumlahtiket = this.state.pilihan.length;
    const harga = jumlahtiket * 25000;
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">
            {jumlahtiket} ticket(s) × {Numeral(25000).format("Rp0,0")}
          </span>
          <span className="text-xl font-bold text-blue-600">
            {Numeral(harga).format("Rp0,0")}
          </span>
        </div>
      </div>
    );
  };

  renderseat = () => {
    const { seats, baris, booked, pilihan } = this.state;
    if (baris === 0) return null;

    const seatsPerRow = seats / baris;
    let arr = Array(baris).fill(null).map(() => Array(seatsPerRow).fill(1));

    booked.forEach(val => {
      if (val.row < baris && val.seat < seatsPerRow) arr[val.row][val.seat] = 3;
    });
    pilihan.forEach(val => {
      if (val.row < baris && val.seat < seatsPerRow) arr[val.row][val.seat] = 2;
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
          {arr.map((rowSeats, rowIndex) => (
            <div key={rowIndex} className="flex justify-center mb-2">
              {rowSeats.map((seatStatus, seatIndex) => {
                let seatClass = "bg-gray-200 hover:bg-gray-300 text-gray-700 border-2 border-gray-300";
                let disabled = false;
                let onClickHandler = () => this.onPilihSeatClick(rowIndex, seatIndex);

                if (seatStatus === 2) { // Selected
                  seatClass = "bg-green-500 text-white hover:bg-green-600 border-2 border-green-600";
                  onClickHandler = () => this.onCancelseatClick(rowIndex, seatIndex);
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
  
  renderbutton = () => {
    if (!this.state.datamovie.jadwal) return null;
    return (
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {this.state.datamovie.jadwal.map((val) => (
          <button
            key={val}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
              this.state.jam === val
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50"
            }`}
            onClick={() => this.onButtonjamclick(val)}
            disabled={this.state.loading && this.state.jam !== val}
          >
            <FaClock className="inline mr-2" />
            {val}:00
          </button>
        ))}
      </div>
    );
  };

  handleBeliTiketSuccess = () => {
    // Instead of window.location.reload(), redirect to home or another appropriate page
    this.setState({ redirecthome: true }); 
  };

  renderStepIndicator = () => {
    const { orderStep } = this.state;
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

  renderCustomerInfoStep = () => {
    const { customerInfo } = this.state;

    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Customer Information</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={customerInfo.name}
              onChange={(e) => this.handleCustomerInfoChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={customerInfo.email}
              onChange={(e) => this.handleCustomerInfoChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => this.handleCustomerInfoChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => this.goBackToStep(1)}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back
          </button>
          <button
            onClick={this.handleCustomerInfoSubmit}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  renderPaymentStep = () => {
    const { paymentMethod, processingPayment } = this.state;
    const totalAmount = this.state.pilihan.length * 25000;

    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Payment Method</h3>

        <div className="space-y-4 mb-6">
          <div
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              paymentMethod === 'credit_card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onClick={() => this.setState({ paymentMethod: 'credit_card' })}
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
            onClick={() => this.setState({ paymentMethod: 'bank_transfer' })}
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
            onClick={() => this.goBackToStep(2)}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            disabled={processingPayment}
          >
            Back
          </button>
          <button
            onClick={this.handlePaymentSubmit}
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

  renderConfirmationStep = () => {
    const { orderId, customerInfo } = this.state;
    const totalAmount = this.state.pilihan.length * 25000;

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
              <span className="font-semibold">{this.state.datamovie.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Showtime:</span>
              <span className="font-semibold">{this.state.jam}:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Seats:</span>
              <span className="font-semibold">
                {this.state.pilihan.map(seat =>
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
            onClick={() => this.setState({ redirecthome: true })}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
          <button
            onClick={this.resetOrder}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Book Another Ticket
          </button>
        </div>
      </div>
    );
  };

  render() {
    if (!this.props.location.state || !this.props.AuthLog) {
      return <Navigate to="/login" replace />;
    }
    if (this.state.redirecthome) {
      return <Navigate to="/" replace />;
    }

    const { orderStep, datamovie, loading, pilihan } = this.state;

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
          {this.renderStepIndicator()}

          {/* Movie Info */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-center space-x-4">
              <FaFilm className="text-blue-600 text-2xl" />
              <h2 className="text-2xl font-bold text-gray-900">{datamovie.title}</h2>
            </div>
            {orderStep === 1 && (
              <div className="mt-4 text-center">
                <p className="text-gray-600 mb-4">Select your preferred showtime:</p>
                {loading && pilihan.length === 0 ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  this.renderbutton()
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
                this.renderseat()
              )}

              {/* Price Summary and Continue Button */}
              {pilihan.length > 0 && (
                <div className="mt-8 max-w-md mx-auto">
                  {this.renderHarga()}
                  <button
                    onClick={this.onOrderClick}
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
                  >
                    <FaTicketAlt className="inline mr-2" />
                    Continue to Customer Info
                  </button>
                </div>
              )}
            </div>
          )}

          {orderStep === 2 && this.renderCustomerInfoStep()}
          {orderStep === 3 && this.renderPaymentStep()}
          {orderStep === 4 && this.renderConfirmationStep()}
        </div>
      </div>
    );
  }
}

// Wrapper component to provide router props to class component
const BelitiketWrapper = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Belitiket
      {...props}
      location={location}
      navigate={navigate}
    />
  );
};

const MapstateToprops = state => {
  return {
    AuthLog: state.Auth.login,
    UserId: state.Auth.id
  };
};
export default connect(MapstateToprops)(BelitiketWrapper);
