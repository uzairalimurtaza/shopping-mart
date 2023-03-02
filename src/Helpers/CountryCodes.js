import Endpoint from "./../Utils/Endpoint";
import axios from "axios";
export async function CountryCodes() {
  const response = await axios.get(
    Endpoint + "/api/location/get-vendorAllowedCountries"
  );
  var array = [];
  var { Countries } = response.data;
  for (let i = 0; i < Countries.length; i++) {
    array.push(Countries[i]["ISO2"].toLowerCase());
  }
  return array;
}
