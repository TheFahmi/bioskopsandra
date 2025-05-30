import React, { useState } from "react";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { LogoutSuccessAction } from "./../redux/actions";
import { FaCartPlus } from "react-icons/fa";

const Header = props => {
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();

  const toggle = () => setIsOpen(!isOpen);

  const logOutUser = () => {
    localStorage.clear();
    props.LogoutSuccessAction(); // Dispatch action via props
    history.push("/"); // Redirect to home after logout
  };

  return (
    <Navbar bg="dark" variant="dark" expand="md" style={{ minHeight: "80px" }} className="p-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">IMAX</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggle} />
        <Navbar.Collapse id="basic-navbar-nav" isOpen={isOpen}>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            {props.role === "admin" && (
              <>
                <Nav.Link as={Link} to="/manageAdmin">
                  Manage Admin
                </Nav.Link>
                <Nav.Link as={Link} to="/manageStudio">
                  Manage Studio
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {props.AuthLog ? (
              <>
                <Navbar.Text className="me-3 text-white">
                  Selamat Datang, {props.AuthLog}
                </Navbar.Text>
                {props.role === "user" && (
                  <Nav.Link as={Link} to="/cart" className="text-white me-3">
                    <FaCartPlus style={{ fontSize: "20px" }} />
                    {props.notif > 0 && <span className="badge bg-danger ms-1">{props.notif}</span>}
                  </Nav.Link>
                )}
                <NavDropdown title="Account" id="basic-nav-dropdown" align="end">
                  <NavDropdown.Item as={Link} to="/gantipassword">
                    Ganti Password
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logOutUser}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const MapstateToprops = state => {
  return {
    AuthLog: state.Auth.username,
    role: state.Auth.role,
    authLogin: state.Auth.login, // Kept for compatibility, though AuthLog is primary check now
    notif: state.Auth.notif
  };
};

export default connect(MapstateToprops, { LogoutSuccessAction })(Header);
