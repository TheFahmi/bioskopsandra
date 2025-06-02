import React, { useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import { gantiPassword } from "./../redux/actions";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

const Gantipass = (props) => {
  const [backtohome, setBacktohome] = useState(false);
  const passwordBaruRef = useRef(null);
  const passwordLamaRef = useRef(null);
  const confirmPassRef = useRef(null);

  const onClickgantipass = () => {
    const passwordbaru = passwordBaruRef.current.value;
    const passwordlama = passwordLamaRef.current.value;
    const confirmPassword = confirmPassRef.current.value;

    const { username, role, userId, passuser } = props;

    if (passwordlama === "" || passwordbaru === "" || confirmPassword === "") {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "All password fields must be filled."
      });
    } else if (passwordlama === passwordbaru) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "New password cannot be the same as the old password."
      });
    } else if (passwordlama !== passuser) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Old password is incorrect."
      });
    } else if (passwordbaru !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "New password confirmation does not match."
      });
    } else {
      const updatedPasswordData = {
        username, // username and role are usually not needed for password change if userId is key
        password: passwordbaru, // send the new password
        role
      };
      Swal.fire({
        title: "Are you sure you want to change your password?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "No",
        confirmButtonText: "Yes"
      }).then(result => {
        if (result.value) {
          Axios.patch(`${APIURL}users/${userId}`, updatedPasswordData)
            .then(res => {
              props.gantiPassword(res.data); // Update Redux state with the new user data (which includes new pass)
              setBacktohome(true);
              Swal.fire({
                icon: "success",
                title: "Password Changed!",
                text: "Your password has been successfully updated.",
                showConfirmButton: false,
                timer: 2000
              });
            })
            .catch(err => {
               // console.log(err);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "An error occurred while changing the password."
              });
            });
        }
      });
    }
  };

  if (backtohome || !props.loginuser) { // Corrected logic for !props.loginuser
    return <Navigate to="/" replace />;
  }

    return (
      <Container className="mt-5">
        <Row className="justify-content-md-center">
          <Col md={6} lg={5}>
            <Card className="p-4 shadow-sm">
              <Card.Body>
                <h2 className="text-center mb-4">Change Password</h2>
                <Form>
                  <Form.Group className="mb-3" controlId="formOldPassword">
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter old password" ref={passwordLamaRef} />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formNewPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter new password" ref={passwordBaruRef} />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formConfirmNewPassword">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control type="password" placeholder="Re-enter new password" ref={confirmPassRef} />
                  </Form.Group>

                  <div className="d-grid mt-4">
                    <Button variant="primary" onClick={onClickgantipass} size="lg">
                      Update Password
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
};
const MapstateToprops = state => {
  return {
    username: state.Auth.username,
    loginuser: state.Auth.login,
    userId: state.Auth.id,
    passuser: state.Auth.password, // Assuming this is the current password stored in Redux
    role: state.Auth.role
  };
};
export default connect(MapstateToprops, { gantiPassword })(Gantipass);
