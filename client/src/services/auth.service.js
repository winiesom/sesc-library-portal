import Cookies from "js-cookie";
import api from "../api/api";


const login = (loginData) =>
  api
    .post("login", loginData)
    .then((response) => {
      if (response.data) {
        Cookies.set("token", response.data["token"]);
      }
      return response.data;
    });


const logout = () =>
  api.post("logout", {}).then((response) => {
    if (response.data) {
      Cookies.remove("token");
    }
    return response.data;
  });



const authService = {
  login,
  logout
};

export default authService;
