import {
  WISHLIST_REQUEST_SUCCESS,
  WISHLIST_REQUEST_PENDING,
  WISHLIST_REQUEST_FAILED,
} from "../Constants/Constants";
export const WishList_Reducer = (
  state = {
    data: [],
    loading: true,
  },
  action
) => {
  switch (action.type) {
    case WISHLIST_REQUEST_PENDING:
      return state;
    case WISHLIST_REQUEST_SUCCESS:
      return {
        data: action.payload,
        loading: false,
      };
    case WISHLIST_REQUEST_FAILED:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
export const Remove_WishList_Reducer = (
  state = {
    data: [],
    loading: true,
  },
  action
) => {
  switch (action.type) {
    case WISHLIST_REQUEST_PENDING:
      return state;
    case WISHLIST_REQUEST_SUCCESS:
      return {
        data: action.payload,
        loading: false,
      };
    case WISHLIST_REQUEST_FAILED:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
