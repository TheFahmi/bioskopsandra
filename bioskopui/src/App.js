import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { connect } from "react-redux";
import Axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";
import Home from "./pages/Home";
import ManageMovies from "./pages/ManageMovies";
import Login from "./pages/Login";
import { APIURL } from "./support/ApiUrl";
import Slider from "./components/Slider";
import RegisterUser from "./pages/RegisterUser";
import WelcomePages from "./components/WelcomePages";
import MovieDetail from "./pages/MovieDetail";
import BuyTicket from "./pages/BuyTicket";
import { LoginSuccessAction, NotifCart } from "./redux/actions";
import Cart from "./pages/Cart";
import ChangePassword from "./pages/ChangePassword";
import ManageStudios from './pages/ManageStudios';
import NotFound from './pages/NotFound';
import Orders from "./pages/Orders";
import Transactions from "./pages/Transactions";

const App = (props) => {
  const [loading, setLoading] = useState(true);
  const [datacart, setDatacart] = useState([]);

  useEffect(() => {
    const id = localStorage.getItem("fakhran");
    Axios.get(`${APIURL}/users/${id}`)
      .then(res => {
        // console.log(res.data);
        props.LoginSuccessAction(res.data);
        Axios.get(`${APIURL}/orders?_expand=movie&userId=${props.userId}&bayar=false`)
          .then(res1 => {
            const datacart = res1.data;
            setDatacart(datacart);
            setLoading(false);
          })
          .catch(err => {
            // console.log(err);
          });
        // setLoading(false);
      })
      .catch(err => {
        // console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [props]);

  useEffect(() => {
    props.NotifCart(datacart.length);
  }, [datacart, props]);

  if (loading) {
    return <div>Loading....</div>;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <>
            <Header />
            <Slider />
            <Home />
            <WelcomePages />
            <Footer />
          </>
        } />
        <Route path="/manage-movies" element={
          <>
            <Header />
            <ManageMovies />
            <Footer />
          </>
        } />
        <Route path="/movie-detail/:id" element={
          <>
            <Header />
            <MovieDetail />
            <Footer />
          </>
        } />
        <Route path="/buy-ticket" element={
          <>
            <Header />
            <BuyTicket />
            <Footer />
          </>
        } />
        <Route path="/login" element={
          <>
            <Header />
            <Login />
            <Footer />
          </>
        } />
        <Route path="/register" element={
          <>
            <Header />
            <RegisterUser />
            <Footer />
          </>
        } />
        <Route path="/cart" element={
          <>
            <Header />
            <Cart />
            <Footer />
          </>
        } />
        <Route path="/orders" element={
          <>
            <Header />
            <Orders />
            <Footer />
          </>
        } />
        <Route path="/transactions" element={
          <>
            <Header />
            <Transactions />
            <Footer />
          </>
        } />
        <Route path="/change-password" element={
          <>
            <Header />
            <ChangePassword />
            <Footer />
          </>
        } />
        <Route path="/manage-studios" element={
          <>
            <Header />
            <ManageStudios />
            <Footer />
          </>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const MapstateToprops = state => {
  return {
    AuthLog: state.Auth.login,
    userId: state.Auth.id
  };
};

export default connect(MapstateToprops, { LoginSuccessAction, NotifCart })(App);
