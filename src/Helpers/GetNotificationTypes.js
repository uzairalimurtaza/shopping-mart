import axios from "axios";
import Endpoint from "./../Utils/Endpoint";
import BanglaBazarApi from './../Components/Api/BanglaBazarApi';

export const GetNotificationType = async (type) => {
  try {
    var response = await BanglaBazarApi.get(Endpoint + "/api/admin/type");
    let obj = {};
    let data = response.data.data;
    for (let i = 0; i < data.length; i++) {
      obj[data[i].TypeName] = data[i].TypeID;
    }
    return obj[type];
  } catch (e) {
    console.log(e);
  }
};
