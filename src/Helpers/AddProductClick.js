import Endpoint from "./../Utils/Endpoint";
import BanglaBazarApi from "./../Components/Api/BanglaBazarApi";
import { CurrentUser } from "./Auth";

async function AddProductClick(product, currentIPv4) {
  // console.log(product);
  // const { currentIPv4 } = state;
  let form = new URLSearchParams();
  let productIds = [product.ProductID];
  if (CurrentUser) {
    console.log("Yes there is");
    for (let i = 0; i < productIds.length; i++) {
      form.append([`ProductID[${i}]`], productIds[i]);
    }
    form.append("UserID", CurrentUser.UserID);
    form.append("SessionID[0]", localStorage.getItem("accessToken"));
    form.append("IPAddress[0]", currentIPv4.IP.IPv4);
    form.append("Country[0]", currentIPv4.IP.country_name);

    await BanglaBazarApi.post(`${Endpoint}/api/product/addProductClicks`, form);
    localStorage.removeItem("uBH")
    return;
  }

  var localUserBrowsing = JSON.parse(localStorage.getItem("uBH"));

  if (localUserBrowsing) {
    // console.log(localUserBrowsing);
    var array = localUserBrowsing;
    let found = false;
    for (let i = 0; i < array.length; i++) {
      if (parseInt(array[i].ProductID) === parseInt(product.ProductID)) {
        found = true;
      }
    }
    if (!found) {
      array.push(product);
    }
    localStorage.setItem("uBH", JSON.stringify(array));
  } else {
    var array = [];
    array.push(product);
    localStorage.setItem("uBH", JSON.stringify(array));
  }

  return null;
}
export default AddProductClick;
