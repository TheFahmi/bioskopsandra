import React, { Component } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { Table, Modal, Button, Container, Row, Col } from "react-bootstrap"; // Updated imports
import { APIURL } from "./../support/ApiUrl";
// import { NotifCart } from "./../redux/actions"; // NotifCart is imported but not used

class Cart extends Component {
  state = {
    datacart: null,
    modaldetail: false,
    indexdetail: 0
  };

  componentDidMount() {
    Axios.get(`${APIURL}orders?_expand=movie&userId=${this.props.UserId}&bayar=false`)
      .then(res => {
        const datacart = res.data;
        const qtyarr = [];
        res.data.forEach(element => {
          qtyarr.push(Axios.get(`${APIURL}ordersDetails?orderId=${element.id}`));
        });
        Axios.all(qtyarr)
          .then(res1 => {
            const qtyarrfinal = res1.map(val => val.data);
            const datafinal = datacart.map((val, index) => ({
              ...val,
              qty: qtyarrfinal[index]
            }));
            this.setState({ datacart: datafinal });
          })
          .catch(err1 => {
            console.error("Error fetching order details:", err1);
          });
      })
      .catch(err => {
        console.error("Error fetching orders:", err);
      });
  }

  renderCart = () => {
    if (!this.state.datacart) {
      return (
        <tr>
          <td colSpan="5" className="text-center">Loading cart data...</td>
        </tr>
      );
    }
    if (this.state.datacart.length === 0) {
      return (
        <tr>
          <td colSpan="5" className="text-center">Your cart is empty.</td>
        </tr>
      );
    }
    return this.state.datacart.map((val, index) => {
      return (
        <tr key={val.id}> {/* Changed key to val.id */}
          <td>{index + 1}</td>
          <td>{val.movie.title}</td>
          <td>{val.jadwal}</td>
          <td>{val.qty.length}</td>
          <td>
            <Button variant="dark" size="sm" onClick={() => this.setState({ modaldetail: true, indexdetail: index })}>
              Details
            </Button>
          </td>
        </tr>
      );
    });
  };

  render() {
    const { datacart, modaldetail, indexdetail } = this.state;
    const currentCartItem = datacart && datacart.length > 0 ? datacart[indexdetail] : null;

    return (
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <h2 className="text-center mb-4">Your Cart</h2>
            {/* Detail Modal */}
            <Modal show={modaldetail} onHide={() => this.setState({ modaldetail: false })} centered>
              <Modal.Header closeButton>
                <Modal.Title>Order Details - {currentCartItem && currentCartItem.movie.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {currentCartItem && currentCartItem.qty ? (
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Seat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCartItem.qty.map((seatDetail, seatIndex) => (
                        // Assuming seatDetail doesn't have a unique ID, seatIndex is acceptable here for this specific list
                        <tr key={seatIndex}> 
                          <td>{seatIndex + 1}</td>
                          <td>{'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[seatDetail.row]}{seatDetail.seat + 1}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p>No seat details available.</p>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => this.setState({ modaldetail: false })}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Cart Table */}
            <Table striped bordered hover responsive className="shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Schedule</th>
                  <th>Quantity</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>{this.renderCart()}</tbody>
            </Table>
            {datacart && datacart.length > 0 && (
              <div className="text-end mt-3">
                <Button variant="primary" size="lg">Checkout</Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

const MapstateToprops = state => {
  return {
    // Authlog: state.Auth.login, // Authlog not used in component
    UserId: state.Auth.id
  };
};

export default connect(MapstateToprops)(Cart); // Removed unused NotifCart from connect HOC
