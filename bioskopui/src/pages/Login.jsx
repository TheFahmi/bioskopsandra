import React, { useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { LoginSuccessAction, Loginthunk, Login_error } from "./../redux/actions";
import { Puff } from "react-loader-spinner";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";

const Login = (props) => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const onLoginClick = () => {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    props.Loginthunk(username, password);
  };

  if (props.AuthLog) {
    return <Navigate to="/" replace />;
  }
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              <FaSignInAlt className="inline-block mr-3 text-blue-600" />
              Welcome Back
            </h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            {props.Auth.error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{props.Auth.error}</p>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLoginClick(); }}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2 text-blue-600" />
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  ref={usernameRef}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  <FaLock className="inline mr-2 text-blue-600" />
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  ref={passwordRef}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                  placeholder="Enter your password"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={props.Auth.loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out transform hover:scale-105"
                >
                  {props.Auth.loading ? (
                    <div className="flex items-center">
                      <Puff
                        height="20"
                        width="20"
                        radius={1}
                        color="#ffffff"
                        ariaLabel="puff-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                      />
                      <span className="ml-2">Signing in...</span>
                    </div>
                  ) : (
                    <span className="flex items-center">
                      <FaSignInAlt className="mr-2" />
                      Sign In
                    </span>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out"
                >
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
};

const MapstateToprops = state => {
  return {
    AuthLog: state.Auth.login,
    Auth: state.Auth // Contains error and loading state
  };
};

export default connect(MapstateToprops, { LoginSuccessAction, Loginthunk, Login_error })(Login);
