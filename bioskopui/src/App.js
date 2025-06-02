import React, { Component } from "react";
import Header from "./components/header";
import "./App.css";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import ManageAdmin from "./pages/manageAdmin";
import Login from "./pages/login";
import Axios from "axios";
import { APIURL } from "./support/ApiUrl";
import Slider from "./components/slider";
import RegisterUser from "./pages/RegisterUser";

import Moviedetail from "./pages/movie-detail";
import Belitiket from "./pages/belitiket";
import { connect } from "react-redux";
import { LoginSuccessAction, NotifCart } from "./redux/actions";
import Cart from "./pages/cart";
import Gantipass from "./pages/gantipassword";
import ManageStudio from './pages/manageStudio';
import Orders from "./pages/orders";
import Transactions from "./pages/transactions";

class App extends Component {
  state = {
    loading: true,
    datacart: []
  };

  componentDidMount() {
    var id = localStorage.getItem("fakhran");
    Axios.get(`${APIURL}users/${id}`)
      .then(res => {
        // console.log(res.data);
        this.props.LoginSuccessAction(res.data);
        Axios.get(`${APIURL}orders?_expand=movie&userId=${this.props.userId}&bayar=false`)
          .then(res1 => {
            var datacart = res1.data;
            this.setState({
              datacart: datacart,
              loading: false
            });
          })
          .catch(err => {
            // console.log(err);
          });
        // this.setState({ loading: false });
      })
      .catch(err => {
        // console.log(err);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  render() {
    if (this.state.loading) {
      return <div>Loading....</div>;
    }
    {
      this.props.NotifCart(this.state.datacart.length);
    }
    return (
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <Slider />
              <Home />
            </>
          } />
          <Route path="/manageAdmin" element={<ManageAdmin />} />
          <Route path="/moviedetail/:id" element={<Moviedetail />} />
          <Route path="/belitiket" element={<Belitiket />} />
          <Route path="/login" element={<Login />} />
          <Route path="/RegisterUser" element={<RegisterUser />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/gantipassword" element={<Gantipass />} />
          <Route path="/manageStudio" element={<ManageStudio />} />
        </Routes>
      </div>
    );
  }
}

const MapstateToprops = state => {
  return {
    AuthLog: state.Auth.login,
    userId: state.Auth.id
  };
};

export default connect(MapstateToprops, { LoginSuccessAction, NotifCart })(App);
