import {
  CATEGORY_REQUEST_SUCCESS,
  CATEGORY_REQUEST_PENDING,
  CATEGORY_REQUEST_FAILED,
  LANDING_REQUEST_SUCCESS,
  LANDING_REQUEST_PENDING,
  LANDING_REQUEST_FAILED,
  IP_REQUEST_SUCCESS,
  IP_REQUEST_FAILED,
} from "../Constants/Constants";
import BanglaBazarApi from "./../Components/Api/BanglaBazarApi";
import Endpoint from "./../Utils/Endpoint";
import axios from "axios";
export const getLandingPageData = (Country, UserID) => async (dispatch) => {
  try {
    dispatch({
      type: LANDING_REQUEST_PENDING,
      payload: []
    });
    var form = new URLSearchParams();
    form.append("Country", Country);
    form.append("UserID", UserID);
    var response = await BanglaBazarApi.post(
      `${Endpoint}/api/landing-page/showProductsViews`,
      form
    );
    if (response.data.status) {
      dispatch({
        type: LANDING_REQUEST_SUCCESS,
        payload: response.data,
      });
    } else {
      dispatch({
        type: LANDING_REQUEST_FAILED,
        payload: response.data.message || response.data.error,
      });
    }
  } catch (e) {
    if (e.response) {
      dispatch({
        type: LANDING_REQUEST_FAILED,
        payload: e.response.data.message || e.response.data.error,
      });
    } else {
      dispatch({
        type: LANDING_REQUEST_FAILED,
        payload: "Something went wrong!",
      });
    }
  }
};
export const getCategoryAndSubCategory = () => async (dispatch) => {
  try {
    dispatch({
      type: CATEGORY_REQUEST_PENDING,
      payload: []
    });

    var response = await BanglaBazarApi.get(
      `${Endpoint}/api/category/get-allCategoriesAndSubCategories`
    );
    if (response.data.status) {
      dispatch({
        type: CATEGORY_REQUEST_SUCCESS,
        payload: response.data.categoriesAndSubCategories,
      });
    } else {
      dispatch({
        type: CATEGORY_REQUEST_FAILED,
        payload: response.data.message || response.data.error,
      });
    }
  } catch (e) {
    if (e.response) {
      dispatch({
        type: CATEGORY_REQUEST_FAILED,
        payload: e.response.data.message || e.response.data.error,
      });
    } else {
      dispatch({
        type: CATEGORY_REQUEST_FAILED,
        payload: "Something went wrong",
      });
    }
  }
};
export const getCurrentIpv4 = () => async (dispatch) => {
  try {
    dispatch({
      type: CATEGORY_REQUEST_PENDING,
      payload: []
    });

    // var response = await axios.get("https://geolocation-db.com/json/");
    dispatch({
      type: IP_REQUEST_SUCCESS,
      payload: {
        IPv4: "43.251.255.77",
        city: null,
        country_code: "PK",
        country_name: "Pakistan",
        latitude: 30,
        longitude: 70,
        postal: null,
        state: null,
      },
    });
  } catch (e) {
    dispatch({
      type: IP_REQUEST_FAILED,
      payload: {},
    });
  }
};