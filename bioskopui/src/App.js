import React, { Component } from "react";
import Header from "./components/header";
import "./App.css";
import Home from "./pages/Home";
import { Switch, Route } from "react-router-dom";
import ManageAdmin from "./pages/manageAdmin";
import Login from "./pages/login";
import Axios from "axios";
import { APIURL } from "./support/ApiUrl";
import Slider from "./components/slider";
import RegisterUser from "./pages/RegisterUser";
import WelcomePages from "./components/welcomePages";
import Moviedetail from "./pages/movie-detail";
import Belitiket from "./pages/belitiket";
import { connect } from "react-redux";
import { LoginSuccessAction, NotifCart } from "./redux/actions";
import Cart from "./pages/cart";
import Gantipass from "./pages/gantipassword";
import manageStudio from './pages/manageStudio'

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
        <Switch>
          <Route path={"/"} exact>
            <Slider />
            <Home />
            <WelcomePages />
          </Route>
          <Route exact path={"/manageAdmin"}>
            <ManageAdmin />
          </Route>
          <Route path="/moviedetail/:id" component={Moviedetail} exact />
          <Route path="/belitiket" component={Belitiket}></Route>
          <Route path={"/login"} exact component={Login} />
          <Route path={"/RegisterUser"} exact component={RegisterUser} />
          <Route path={"/cart"} component={Cart} exact />
          <Route path="/gantipassword" component={Gantipass} exact/>
          <Route path="/manageStudio" component={manageStudio} exact/>
        </Switch>
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
