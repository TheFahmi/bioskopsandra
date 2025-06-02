import React, { Component } from "react";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import Swal from "sweetalert2";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

class RegisterUser extends Component {
  state = {
    // error: "", // Not used, Swal handles error display
    // loading: false // No visual loader in the original, can be added if desired
  };

  onRegisterClick = () => {
    const username = this.usernameRef.value;
    const password = this.passwordRef.value;
    const enterpassword = this.enterPasswordRef.value;
    const role = "user";
    const newuser = { username, password, role };

    if (username === "" || password === "" || enterpassword === "") {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "All fields are required."
      });
    } else {
      Axios.get(`${APIURL}users?username=${username}`)
        .then(res => {
          if (res.data.length === 0) {
            if (password !== enterpassword) {
              Swal.fire({
                icon: "error",
                title: "Registration Failed",
                text: "Passwords do not match."
              });
            } else {
              Axios.post(`${APIURL}users`, newuser)
                .then(res1 => {
                  Swal.fire({
                    icon: "success",
                    title: "Registration Successful",
                    text: "User has been registered. Please login."
                  });
                  this.props.history.push("/login"); // Ensure path is correct, usually with a leading slash
                })
                .catch(err1 => {
                  // console.log(err1);
                  Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "An unexpected error occurred during registration."
                  });
                });
            }
          } else {
            Swal.fire({
              icon: "error",
              title: "Registration Failed",
              text: "Username already exists."
            });
          }
        })
        .catch(err => {
          // console.log(err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred while checking username availability."
          });
        });
    }
  };

  render() {
    return (
      <Container className="mt-5">
        <Row className="justify-content-md-center">
          <Col md={6} lg={5}>
            <Card className="p-4 shadow-sm">
              <Card.Body>
                <h2 className="text-center mb-4">Register</h2>
                <Form>
                  <Form.Group className="mb-3" controlId="formRegisterUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" ref={ref => (this.usernameRef = ref)} />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formRegisterPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" ref={ref => (this.passwordRef = ref)} />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formRegisterEnterPassword">
                    <Form.Label>Re-enter Password</Form.Label>
                    <Form.Control type="password" placeholder="Re-enter password" ref={ref => (this.enterPasswordRef = ref)} />
                  </Form.Group>

                  <div className="d-grid mt-4">
                    <Button variant="success" onClick={this.onRegisterClick} size="lg">
                      Register
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default RegisterUser;
