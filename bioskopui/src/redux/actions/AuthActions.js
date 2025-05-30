import { APIURL } from "../../support/ApiUrl";
import Axios from "axios";

export const LoginSuccessAction = datauser => {
  return {
    type: "LOGIN_SUCCESS",
    payload: datauser
  };
};

export const LogoutSuccessAction = () => {
  return {
    type: "LOGOUT_SUCCESS"
  };
};

export const NotifCart = cart => {
  return {
    type: "NOTIF_AKTIF",
    payload: cart
  };
};

export const Loginthunk = (username, password) => {
  return dispatch => {
    dispatch({ type: "LOGIN_LOADING" });
    Axios.get(`${APIURL}users?username=${username}&password=${password}`)
      .then(res => {
        // console.log(res.data);
        if (res.data.length) {
          window.location.reload();
          localStorage.setItem("fakhran", res.data[0].id);
          dispatch(LoginSuccessAction(res.data[0]));
        } else {
          dispatch({ type: "LOGIN_ERROR", payload: "Salah masukkin Password" });
        }
      })
      .catch(err => {
        // console.log(err);
        dispatch({ type: "LOGIN_ERROR", payload: "server error" });
      });
  };
};

export const Login_error = () => {
  return dispatch => {
    return dispatch => {
      dispatch({ type: "LOGIN_ERROR", payload: "" });
    };
  };
};

export const gantiPassword =(newpass)=>{
  return {
    type:'GANTI_PASSWORD',
    payload:newpass
  }
}