import Endpoint from "./../Utils/Endpoint";
import BanglaBazarApi from "./../Components/Api/BanglaBazarApi";
import {
  GET_ORDER_DETAILS_SUCCESS,
  GET_ORDER_DETAILS_PENDING,
  GET_ORDER_DETAILS_FAILED,
} from "../Constants/Constants";
export const GetUserOrderDetails = (paginate) => async (dispatch) => {
  try {
    dispatch({ type: GET_ORDER_DETAILS_PENDING, payload: [] });
    var response = await BanglaBazarApi.post(
      `${Endpoint}/api/payment/order-details`, paginate
    );
    if (response.data.status) {
      dispatch({
        type: GET_ORDER_DETAILS_SUCCESS,
        payload: response.data,
      });
    } else {
      dispatch({
        type: GET_ORDER_DETAILS_FAILED,
        payload: response.data.message || response.data.error,
      });
    }
  } catch (e) {
    if (e.response) {
      dispatch({
        type: GET_ORDER_DETAILS_FAILED,
        payload: e.response.data.message || e.response.data.error,
      });
    } else {
      dispatch({
        type: GET_ORDER_DETAILS_FAILED,
        payload: "Something went wrong",
      });
    }
  }
};
