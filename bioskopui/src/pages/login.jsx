import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { LoginSuccessAction, Loginthunk, Login_error } from "./../redux/actions";
import Loader from "react-loader-spinner";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";

class Login extends Component {
  // state = {}; // No local state needed if refs are used for form inputs

  onLoginClick = () => {
    const username = this.usernameRef.value;
    const password = this.passwordRef.value;
    this.props.Loginthunk(username, password);
  };

  render() {
    if (this.props.AuthLog) {
      return <Redirect to={"/"} />;
    }
    return (
      <Container className="mt-5">
        <Row className="justify-content-md-center">
          <Col md={6} lg={5}>
            <Card className="p-4 shadow-sm">
              <Card.Body>
                <h2 className="text-center mb-4">Login</h2>
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" ref={ref => (this.usernameRef = ref)} />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" ref={ref => (this.passwordRef = ref)} />
                  </Form.Group>

                  {this.props.Auth.error && (
                    <Alert variant="danger" onClose={this.props.Login_error} dismissible>
                      {this.props.Auth.error}
                    </Alert>
                  )}

                  <div className="d-grid mt-4">
                    {this.props.Auth.loading ? (
                      <div className="text-center">
                        <Loader type="Puff" color="#00BFFF" height={50} width={50} />
                      </div>
                    ) : (
                      <Button variant="primary" onClick={this.onLoginClick} size="lg">
                        Login
                      </Button>
                    )}
                  </div>
                </Form>
                <div className="mt-3 text-center">
                  Belum punya akun? <Link to={"/RegisterUser"}>Register di sini</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

const MapstateToprops = state => {
  return {
    AuthLog: state.Auth.login,
    Auth: state.Auth // Contains error and loading state
  };
};

export default connect(MapstateToprops, { LoginSuccessAction, Loginthunk, Login_error })(Login);
