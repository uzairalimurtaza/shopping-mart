import BanglaBazarApi from "../Components/Api/BanglaBazarApi";
import {
  WISHLIST_REQUEST_SUCCESS,
  WISHLIST_REQUEST_PENDING,
  WISHLIST_REQUEST_FAILED,
} from "../Constants/Constants";
import Endpoint from "../Utils/Endpoint";

export const Get_Wishlist_Action = () => async (dispatch) => {
  try {
    dispatch({ type: WISHLIST_REQUEST_PENDING, payload: [] });

    var response = await BanglaBazarApi.get(
      `${Endpoint}/api/wish-list/viewUserWishList`
    );
    if (response.data.status) {
      dispatch({
        type: WISHLIST_REQUEST_SUCCESS,
        payload: response.data,
      });
    } else {
      dispatch({
        type: WISHLIST_REQUEST_FAILED,
        payload: response.data.message || response.data.error,
      });
    }
  } catch (e) {
    if (e.response) {
      dispatch({
        type: WISHLIST_REQUEST_FAILED,
        payload: e.response.data.message || e.response.data.error,
      });
    } else {
      dispatch({
        type: WISHLIST_REQUEST_FAILED,
        payload: "Something went wrong",
      });
    }
  }
};
export const Remove_WishlistItem_Action = (id) => async (dispatch) => {
  try {
    dispatch({ type: WISHLIST_REQUEST_PENDING, payload: [] });

    var response = await BanglaBazarApi.get(
      `${Endpoint}/api/wish-list/deleteUserWishList/${id}`
    );
    if (response.data.status) {
      dispatch({
        type: WISHLIST_REQUEST_SUCCESS,
        payload: response.data,
      });
    } else {
      dispatch({
        type: WISHLIST_REQUEST_FAILED,
        payload: response.data.message || response.data.error,
      });
    }
  } catch (e) {
    dispatch({
      type: WISHLIST_REQUEST_FAILED,
      payload: e.response.data.message || e.response.data.error,
    });
  }
};
