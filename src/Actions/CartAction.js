import Endpoint from "./../Utils/Endpoint";
import BanglaBazarApi from "./../Components/Api/BanglaBazarApi";
import { CurrentUser } from "./../Helpers/Auth";

import {
  CART_REQUEST_SUCCESS,
  CART_REQUEST_PENDING,
  CART_REQUEST_FAILED,
  GET_CART_REQUEST_SUCCESS,
  GET_CART_REQUEST_PENDING,
  GET_CART_REQUEST_FAILED,
  REMOVE_CART_REQUEST_SUCCESS,
  REMOVE_CART_REQUEST_PENDING,
  REMOVE_CART_REQUEST_FAILED,
} from "../Constants/Constants";

export const AddCartItems = (data) => async (dispatch) => {
  dispatch({ type: CART_REQUEST_PENDING, payload: [] });

  try {
    var response = await BanglaBazarApi.post(
      `${Endpoint}/api/wish-list/addCart`,
      data
    );
    if (response.data.status) {
      dispatch({
        type: CART_REQUEST_SUCCESS,
        payload: "Item Added To Cart Successfully",
      });
    } else {
      dispatch({
        type: CART_REQUEST_FAILED,
        payload: response.data.message || response.data.error,
      });
    }
  } catch (e) {
    if (e.response) {
      dispatch({
        type: CART_REQUEST_FAILED,
        payload: e.response.data.message || e.response.data.error,
      });
    } else {
      dispatch({
        type: CART_REQUEST_FAILED,
        payload: "Something went wrong",
      });
    }
  }
};
export const GetCartItems = () => async (dispatch) => {
  if (CurrentUser) {
    try {
      dispatch({ type: GET_CART_REQUEST_PENDING, payload: {} });

      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/wish-list/viewCart`
      );
      if (response.data.status) {
        dispatch({
          type: GET_CART_REQUEST_SUCCESS,
          payload: response.data,
        });
      } else {
        dispatch({
          type: GET_CART_REQUEST_FAILED,
          payload: response.data.message || response.data.error,
        });
      }
    } catch (e) {
      // console.log(e);
      if (e.response) {
        dispatch({
          type: GET_CART_REQUEST_FAILED,
          payload: e.response.data.message || e.response.data.error,
        });
      } else {
        dispatch({
          type: GET_CART_REQUEST_FAILED,
          payload: "Something went wrong",
        });
      }
    }
  } else {
    dispatch({
      type: GET_CART_REQUEST_SUCCESS,
      payload: {
        status: true,
        productCartList: [],
        productCombinationPriceDetail: [],
      },
    });
  }
};
export const RemoveCartItems = (ProductID, data) => async (dispatch) => {
  dispatch({ type: REMOVE_CART_REQUEST_PENDING, payload: [] });

  try {
    var response = await BanglaBazarApi.post(
      `${Endpoint}/api/wish-list/removeCart/${ProductID}`,
      data
    );
    if (response.data.status) {
      dispatch({
        type: REMOVE_CART_REQUEST_SUCCESS,
        payload: "Cart Item Removed Successfully",
      });
    } else {
      dispatch({
        type: REMOVE_CART_REQUEST_FAILED,
        payload: response.data.message || response.data.error,
      });
    }
  } catch (e) {
    if (e.response) {
      dispatch({
        type: REMOVE_CART_REQUEST_FAILED,
        payload: e.response.data.message || e.response.data.error,
      });
    } else {
      dispatch({
        type: REMOVE_CART_REQUEST_FAILED,
        payload: "Something went wrong",
      });
    }
  }
};
