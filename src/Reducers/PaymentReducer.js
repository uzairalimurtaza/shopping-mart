import {
  PAYMENT_STATUS_REQUEST_SUCCESS,
  PAYMENT_STATUS_REQUEST_PENDING,
  PAYMENT_STATUS_REQUEST_FAILED,
} from "../Constants/Constants";

export const PaymentStatusReducer = (
  state = {
    data: null,
    loading: true,
  },
  action
) => {
  switch (action.type) {
    case PAYMENT_STATUS_REQUEST_PENDING:
      return state;
    case PAYMENT_STATUS_REQUEST_SUCCESS:
      return {
        data: action.payload,
        loading: false,
      };
    case PAYMENT_STATUS_REQUEST_FAILED:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
