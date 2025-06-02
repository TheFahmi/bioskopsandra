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
        if (res.data.length > 0) {
          const userData = res.data[0];
          localStorage.setItem("fakhran", userData.id);
          dispatch(LoginSuccessAction(userData));
        } else {
          dispatch({ type: "LOGIN_ERROR", payload: "Username atau password salah" });
        }
      })
      .catch(err => {
        dispatch({ type: "LOGIN_ERROR", payload: "Terjadi kesalahan server" });
      });
  };
};

export const Login_error = () => {
  return dispatch => {
    dispatch({ type: "LOGIN_ERROR", payload: "" });
  };
};

export const gantiPassword =(newpass)=>{
  return {
    type:'GANTI_PASSWORD',
    payload:newpass
  }
}