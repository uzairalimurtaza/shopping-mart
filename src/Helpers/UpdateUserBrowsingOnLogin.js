import { CurrentUser } from "./Auth";
import BanglaBazarApi from "./../Components/Api/BanglaBazarApi";
import Endpoint from "./../Utils/Endpoint";
async function UpdateUserBrowsingOnLogin(currentIPv4) {
  let userBrowsing = JSON.parse(localStorage.getItem("uBH"));

  if (userBrowsing && userBrowsing.length > 0) {
    let form = new URLSearchParams();
    form.append("UserID", CurrentUser.UserID);
    for (let i = 0; i < userBrowsing.length; i++) {
      form.append([`ProductID[${i}]`], userBrowsing[i].ProductID);
      form.append(`SessionID[${i}]`, localStorage.getItem("accessToken"));
      form.append(`IPAddress[${i}]`, currentIPv4.IP.IPv4);
      form.append(`Country[${i}]`, currentIPv4.IP.country_name);
    }

    try {
      let response = await BanglaBazarApi.post(
        `${Endpoint}/api/product/addProductClicks`,
        form
      );
      if (response.data.status) {
        localStorage.removeItem("uBH");
      }
      console.log("udateuser")
    } catch (e) {
      console.log(e);
    }
  }

  return null;
}
export default UpdateUserBrowsingOnLogin;
