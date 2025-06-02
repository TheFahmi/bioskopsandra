import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { LogoutSuccessAction } from "./../redux/actions";
import { FaCartPlus, FaUser, FaSignOutAlt, FaKey, FaBars, FaTimes, FaFilm, FaTicketAlt, FaCreditCard, FaHome } from "react-icons/fa";

const Header = props => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggle = () => setIsOpen(!isOpen);

  const logOutUser = () => {
    localStorage.clear();
    props.LogoutSuccessAction(); // Dispatch action via props
    navigate("/"); // Redirect to home after logout
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors duration-200">
            <FaFilm className="text-2xl text-yellow-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Bioskop Sandra
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-white hover:text-yellow-400 transition-colors duration-200 font-medium flex items-center"
            >
              <FaHome className="mr-1" />
              Home
            </Link>

            {props.role === "user" && props.AuthLog && (
              <>
                <Link
                  to="/orders"
                  className="text-white hover:text-yellow-400 transition-colors duration-200 font-medium flex items-center"
                >
                  <FaTicketAlt className="mr-1" />
                  My Orders
                </Link>
                <Link
                  to="/transactions"
                  className="text-white hover:text-yellow-400 transition-colors duration-200 font-medium flex items-center"
                >
                  <FaCreditCard className="mr-1" />
                  Transactions
                </Link>
              </>
            )}

            {props.role === "admin" && (
              <>
                <Link
                  to="/manageAdmin"
                  className="text-white hover:text-yellow-400 transition-colors duration-200 font-medium"
                >
                  Manage Movies
                </Link>
                <Link
                  to="/manageStudio"
                  className="text-white hover:text-yellow-400 transition-colors duration-200 font-medium"
                >
                  Manage Studios
                </Link>
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {props.AuthLog ? (
              <>
                {/* Cart for users */}
                {props.role === "user" && (
                  <Link
                    to="/cart"
                    className="relative p-2 text-white hover:text-yellow-400 transition-colors duration-200"
                  >
                    <FaCartPlus className="text-xl" />
                    {props.notif > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {props.notif}
                      </span>
                    )}
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors duration-200 p-2 rounded-md hover:bg-blue-800"
                  >
                    <FaUser className="text-sm" />
                    <span className="font-medium">{props.AuthLog}</span>
                    <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/gantipassword"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <FaKey className="mr-2" />
                        Change Password
                      </Link>
                      <button
                        onClick={() => {
                          logOutUser();
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-blue-900 px-4 py-2 rounded-md font-medium hover:from-yellow-300 hover:to-orange-300 transition-all duration-200 transform hover:scale-105"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-white hover:text-yellow-400 transition-colors duration-200"
          >
            {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-700">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                onClick={toggleMenu}
                className="flex items-center text-white hover:text-yellow-400 transition-colors duration-200 font-medium py-2"
              >
                <FaHome className="mr-2" />
                Home
              </Link>

              {props.role === "user" && props.AuthLog && (
                <>
                  <Link
                    to="/orders"
                    onClick={toggleMenu}
                    className="flex items-center text-white hover:text-yellow-400 transition-colors duration-200 font-medium py-2"
                  >
                    <FaTicketAlt className="mr-2" />
                    My Orders
                  </Link>
                  <Link
                    to="/transactions"
                    onClick={toggleMenu}
                    className="flex items-center text-white hover:text-yellow-400 transition-colors duration-200 font-medium py-2"
                  >
                    <FaCreditCard className="mr-2" />
                    Transactions
                  </Link>
                </>
              )}

              {props.role === "admin" && (
                <>
                  <Link
                    to="/manageAdmin"
                    onClick={toggleMenu}
                    className="text-white hover:text-yellow-400 transition-colors duration-200 font-medium py-2"
                  >
                    Manage Movies
                  </Link>
                  <Link
                    to="/manageStudio"
                    onClick={toggleMenu}
                    className="text-white hover:text-yellow-400 transition-colors duration-200 font-medium py-2"
                  >
                    Manage Studios
                  </Link>
                </>
              )}

              {props.AuthLog ? (
                <>
                  {props.role === "user" && (
                    <Link
                      to="/cart"
                      onClick={toggleMenu}
                      className="flex items-center text-white hover:text-yellow-400 transition-colors duration-200 font-medium py-2"
                    >
                      <FaCartPlus className="mr-2" />
                      Cart {props.notif > 0 && `(${props.notif})`}
                    </Link>
                  )}
                  <div className="border-t border-blue-700 pt-3 mt-3">
                    <p className="text-blue-200 text-sm mb-2">Welcome, {props.AuthLog}</p>
                    <Link
                      to="/gantipassword"
                      onClick={toggleMenu}
                      className="flex items-center text-white hover:text-yellow-400 transition-colors duration-200 font-medium py-2"
                    >
                      <FaKey className="mr-2" />
                      Change Password
                    </Link>
                    <button
                      onClick={() => {
                        logOutUser();
                        toggleMenu();
                      }}
                      className="flex items-center text-white hover:text-yellow-400 transition-colors duration-200 font-medium py-2"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={toggleMenu}
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 text-blue-900 px-4 py-2 rounded-md font-medium hover:from-yellow-300 hover:to-orange-300 transition-all duration-200 text-center"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Overlay for dropdown */}
      {(isDropdownOpen || isMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsDropdownOpen(false);
            setIsMenuOpen(false);
          }}
        />
      )}
    </header>
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
