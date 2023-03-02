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

export const AddCartItemReducer = (
  state = {
    data: "Processing Request",
    loading: true,
  },
  action
) => {
  switch (action.type) {
    case CART_REQUEST_PENDING:
      return state;
    case CART_REQUEST_SUCCESS:
      return {
        data: action.payload,
        loading: false,
      };
    case CART_REQUEST_FAILED:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const GetCartItemReducer = (
  state = {
    data: [],
    loading: true,
  },
  action
) => {
  switch (action.type) {
    case GET_CART_REQUEST_PENDING:
      return state;
    case GET_CART_REQUEST_SUCCESS:
      console.log({
        data: action.payload,
        loading: false,
      });
      return {
        data: action.payload,
        loading: false,
      };
    case GET_CART_REQUEST_FAILED:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const RemoveCartItemReducer = (
  state = {
    data: [],
    loading: true,
  },
  action
) => {
  switch (action.type) {
    case REMOVE_CART_REQUEST_PENDING:
      return state;
    case REMOVE_CART_REQUEST_SUCCESS:
      return {
        data: action.payload,
        loading: false,
      };
    case REMOVE_CART_REQUEST_FAILED:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
