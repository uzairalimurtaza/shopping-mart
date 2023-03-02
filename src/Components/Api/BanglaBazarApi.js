import axios from "axios";
import Endpoint from "./../../Utils/Endpoint";
const accessToken = localStorage.getItem("accessToken");


const BanglaBazarApi = axios.create({
  baseUrl: Endpoint,
  headers: {
    Authorization: `Bearer ${accessToken}`,
    region : !localStorage.getItem("region") ? "Bangladesh" :localStorage.getItem("region")
  },
});
export default BanglaBazarApi;
