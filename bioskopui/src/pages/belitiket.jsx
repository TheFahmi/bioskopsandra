import React, { Component } from "react";
import { connect } from "react-redux";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import { Modal, Button, Container, Row, Col, ButtonGroup, Spinner } from "react-bootstrap"; // Updated imports
import Numeral from "numeral";
import { Redirect } from "react-router-dom";

// Styles for seats, can be moved to a CSS file if preferred
const seatStyles = {
  width: '40px',
  height: '40px',
  margin: '3px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '12px'
};

class Belitiket extends Component {
  state = {
    datamovie: {},
    seats: 0, // Initialize with 0
    baris: 0, // Initialize with 0
    booked: [],
    loading: true,
    jam: this.props.location.state && this.props.location.state.jadwal && this.props.location.state.jadwal.length > 0 
         ? this.props.location.state.jadwal[0] 
         : 12, // Default to 12 or first available if location state is problematic
    pilihan: [],
    openmodalcart: false,
    redirecthome: false
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

  onOrderClick = () => {
    const { UserId, location } = this.props;
    const { datamovie, pilihan, jam } = this.state;
    const totalharga = pilihan.length * 25000;
    
    const dataorders = {
      userId: UserId,
      movieId: datamovie.id,
      totalharga,
      jadwal: jam,
      bayar: false
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
            this.setState({ openmodalcart: true });
          })
           .catch(err => { /* console.log(err) */ }); // Intentionally kept concise for this specific location
      })
       .catch(err => { /* console.log(err) */ }); // Intentionally kept concise for this specific location
  };

  renderHarga = () => {
    const jumlahtiket = this.state.pilihan.length;
    const harga = jumlahtiket * 25000;
    return (
      <div className="mt-3 h5">
        {jumlahtiket} ticket(s) x {Numeral(25000).format("Rp0,0")} = <strong>{Numeral(harga).format("Rp0,0")}</strong>
      </div>
    );
  };

  renderseat = () => {
    const { seats, baris, booked, pilihan } = this.state;
    if (baris === 0) return null; // Avoid division by zero if baris is not set

    const seatsPerRow = seats / baris;
    let arr = Array(baris).fill(null).map(() => Array(seatsPerRow).fill(1));

    booked.forEach(val => {
      if (val.row < baris && val.seat < seatsPerRow) arr[val.row][val.seat] = 3; // Booked
    });
    pilihan.forEach(val => {
      if (val.row < baris && val.seat < seatsPerRow) arr[val.row][val.seat] = 2; // Selected
    });

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return arr.map((rowSeats, rowIndex) => (
      <div key={rowIndex} className="d-flex justify-content-center mb-1">
        {rowSeats.map((seatStatus, seatIndex) => {
          let variant = "outline-primary";
          let disabled = false;
          let onClickHandler = () => this.onPilihSeatClick(rowIndex, seatIndex);

          if (seatStatus === 2) { // Selected
            variant = "primary";
            onClickHandler = () => this.onCancelseatClick(rowIndex, seatIndex);
          } else if (seatStatus === 3) { // Booked
            variant = "danger";
            disabled = true;
          }
          
          return (
            <Button 
              key={seatIndex} 
              style={seatStyles}
              variant={variant}
              disabled={disabled}
              onClick={onClickHandler}
              className="rounded"
            >
              {alphabet[rowIndex]}{seatIndex + 1}
            </Button>
          );
        })}
      </div>
    ));
  };
  
  renderbutton = () => {
    if (!this.state.datamovie.jadwal) return null;
    return (
      <ButtonGroup className="mb-3">
        {this.state.datamovie.jadwal.map((val) => (
          <Button
            key={val}
            variant={this.state.jam === val ? "dark" : "outline-dark"}
            onClick={() => this.onButtonjamclick(val)}
            disabled={this.state.loading && this.state.jam !== val} // Disable other buttons when loading
          >
            {val}:00
          </Button>
        ))}
      </ButtonGroup>
    );
  };

  handleBeliTiketSuccess = () => {
    // Instead of window.location.reload(), redirect to home or another appropriate page
    this.setState({ redirecthome: true }); 
  };

  render() {
    if (!this.props.location.state || !this.props.AuthLog) {
      return <Redirect to="/login" />; // Or a 404 page / custom message
    }
    if (this.state.redirecthome) {
      return <Redirect to="/" />;
    }

    return (
      <Container className="mt-4">
        <Modal show={this.state.openmodalcart} onHide={() => this.setState({ openmodalcart: false })} centered>
          <Modal.Header closeButton>
            <Modal.Title>Order Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>Seats successfully selected!</Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={this.handleBeliTiketSuccess}>
              Buy Ticket & Go Home
            </Button>
          </Modal.Footer>
        </Modal>

        <Row className="justify-content-center text-center">
          <Col md={8}>
            <h2>{this.state.datamovie.title}</h2>
            <div className="my-3">
              {this.state.loading && this.state.pilihan.length === 0 ? <Spinner animation="border" /> : this.renderbutton()}
            </div>
            
            {this.state.pilihan.length > 0 && this.renderHarga()}

            {this.state.pilihan.length > 0 && (
              <Button variant="success" className="my-3" onClick={this.onOrderClick}>
                Order Now
              </Button>
            )}
          </Col>
        </Row>
        
        <Row className="justify-content-center mt-3">
          <Col md={10} className="overflow-auto" style={{maxWidth: '100%'}}> {/* Added overflow-auto for smaller screens */}
            {this.state.loading ? (
              <div className="text-center"><Spinner animation="grow" variant="info" /> Rendering Seats...</div>
            ) : (
              this.renderseat()
            )}
            <div 
              className="text-center bg-dark text-white p-2 mt-3 rounded shadow-sm" 
              style={{width: '80%', margin: 'auto'}}
            >
              SCREEN
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

const MapstateToprops = state => {
  return {
    AuthLog: state.Auth.login,
    UserId: state.Auth.id
  };
};
export default connect(MapstateToprops)(Belitiket);
