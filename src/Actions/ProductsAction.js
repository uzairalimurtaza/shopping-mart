import {
  PRODUCT_REQUEST_SUCCESS,
  PRODUCT_REQUEST_PENDING,
  PRODUCT_REQUEST_FAILED,
  RECENTLY_VIEWED_REQUEST_SUCCESS,
  RECENTLY_VIEWED_REQUEST_PENDING,
  RECENTLY_VIEWED_REQUEST_FAILED,
} from "../Constants/Constants";
import BanglaBazarApi from "./../Components/Api/BanglaBazarApi";
import Endpoint from "./../Utils/Endpoint";

export const getProductsDetailsById =
  (productID, userID) => async (dispatch) => {
    try {
      dispatch({ type: PRODUCT_REQUEST_PENDING, payload: [] });

      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/product/get-productAllDetails/${productID}/${userID}`
      );
      if (response.data.status) {
        dispatch({
          type: PRODUCT_REQUEST_SUCCESS,
          payload: response.data,
        });
      } else {
        dispatch({
          type: PRODUCT_REQUEST_FAILED,
          payload: response.data.message || response.data.error,
        });
      }
    } catch (e) {
      if (e.response) {
        dispatch({
          type: PRODUCT_REQUEST_FAILED,
          payload: e.response.data.message || e.response.data.error,
        });
      } else {
        dispatch({
          type: PRODUCT_REQUEST_FAILED,
          payload: "Something went wrong while fetching data",
        });
      }
    }
  };

export const getProductsBySubCategoryId =
  (id, limit, offset, sort, status, searchType, search) => async (dispatch) => {
    try {
      dispatch({ type: PRODUCT_REQUEST_PENDING, payload: [] });
      var form = new URLSearchParams();
      form.append("limit", limit);
      form.append("offset", offset);
      form.append("sort", sort);
      form.append("status", status);
      form.append("searchType", searchType);
      form.append("search", search);
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/product/get-mostPopluarAndTopRatedProducts/${id}`,
        form
      );
      if (response.data.status) {
        dispatch({
          type: PRODUCT_REQUEST_SUCCESS,
          payload: response.data,
        });
      } else {
        dispatch({
          type: PRODUCT_REQUEST_FAILED,
          payload: response.data.message || response.data.error,
        });
      }
    } catch (e) {
      if (e.response) {
        dispatch({
          type: PRODUCT_REQUEST_FAILED,
          payload: e.response.data.message || e.response.data.error,
        });
      } else {
        dispatch({
          type: PRODUCT_REQUEST_FAILED,
          payload: "Something went wrong while fetching data",
        });
      }
    }
  };

export const getProductsByCategoryId =
  (id, limit, offset, sort, status, searchType, search) => async (dispatch) => {
    try {
      dispatch({ type: PRODUCT_REQUEST_PENDING, payload: [] });
      var form = new URLSearchParams();
      form.append("limit", limit);
      form.append("offset", offset);
      form.append("sort", sort);
      form.append("status", status);
      form.append("searchType", searchType);
      form.append("search", search);
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/product/get-mostPopluarAndTopRatedProducts/${id}`,
        form
      );
      if (response.data.status) {
        dispatch({
          type: PRODUCT_REQUEST_SUCCESS,
          payload: response.data,
        });
      } else {
        dispatch({
          type: PRODUCT_REQUEST_FAILED,
          payload: response.data.message || response.data.error,
        });
      }
    } catch (e) {
      if (e.response) {
        dispatch({
          type: PRODUCT_REQUEST_FAILED,
          payload: e.response.data.message || e.response.data.error,
        });
      } else {
        dispatch({
          type: PRODUCT_REQUEST_FAILED,
          payload: "Something went wrong while fetching data",
        });
      }
    }
  };

export const getProductsByGlobalSearch =
  (id, keyword, limit, offset, searchType, search) => async (dispatch) => {
    try {
      dispatch({ type: PRODUCT_REQUEST_PENDING, payload: [] });
      var form = new URLSearchParams();
      form.append("CategoryID", id);
      form.append("search", keyword);
      form.append("limit", limit);
      form.append("offset", offset);
      form.append("searchType", searchType);

      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/product/get-gloabalProductsSearchByCategory`,
        form
      );
      if (response.data.status) {
        dispatch({
          type: PRODUCT_REQUEST_SUCCESS,
          payload: response.data,
        });
      } else {
        dispatch({
          type: PRODUCT_REQUEST_FAILED,
          payload: response.data.message || response.data.error,
        });
      }
    } catch (e) {
      if (e.response) {
        dispatch({
          type: PRODUCT_REQUEST_FAILED,
          payload: e.response.data.message || e.response.data.error,
        });
      } else {
        dispatch({
          type: PRODUCT_REQUEST_FAILED,
          payload: "Something went wrong while fetching data",
        });
      }
    }
  };

export const viewMoreRecentlyViewed =
  (limit, offset, UserID) => async (dispatch) => {
    try {
      dispatch({ type: RECENTLY_VIEWED_REQUEST_PENDING, payload: [] });
      var form = new URLSearchParams();
      form.append("limit", limit);
      form.append("offset", offset);
      form.append("UserID", UserID);
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/landing-page/recenltyViewedProducts`,
        form
      );
      if (response.data.status) {
        dispatch({
          type: RECENTLY_VIEWED_REQUEST_SUCCESS,
          payload: response.data,
        });
      } else {
        dispatch({
          type: RECENTLY_VIEWED_REQUEST_FAILED,
          payload: response.data.message || response.data.error,
        });
      }
    } catch (e) {
      if (e.response) {
        dispatch({
          type: RECENTLY_VIEWED_REQUEST_FAILED,
          payload: e.response.data.message || e.response.data.error,
        });
      } else {
        dispatch({
          type: RECENTLY_VIEWED_REQUEST_FAILED,
          payload: "Something went wrong while fetching data",
        });
      }
    }
  };
