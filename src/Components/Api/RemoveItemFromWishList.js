import firetoast from "../../Helpers/FireToast";
import Endpoint from "../../Utils/Endpoint";
import BanglaBazarApi from "./BanglaBazarApi";

var RemoveItemFromWishList = async (id) => {
  try {
    var response = await BanglaBazarApi.delete(
      `${Endpoint}/api/wish-list/deleteUserWishList/${id}`
    );
    if (response.data.status) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    firetoast("Something went wrong", "default-error");
  }
};
export default RemoveItemFromWishList;
