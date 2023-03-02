import {
  GET_ORDER_DETAILS_SUCCESS,
  GET_ORDER_DETAILS_PENDING,
  GET_ORDER_DETAILS_FAILED,
} from "../Constants/Constants";
export const GetOrderDetailsReducer = (
  state = {
    data: [],
    loading: true,
  },
  action
) => {
  switch (action.type) {
    case GET_ORDER_DETAILS_PENDING:
      return state;
    case GET_ORDER_DETAILS_SUCCESS:
      return {
        data: action.payload,
        loading: false,
      };
    case GET_ORDER_DETAILS_FAILED:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
