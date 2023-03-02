import {
  PAYMENT_STATUS_REQUEST_SUCCESS,
  PAYMENT_STATUS_REQUEST_PENDING,
  PAYMENT_STATUS_REQUEST_FAILED,
} from "../Constants/Constants";

export const SetPaymentStatus = (status) => async (dispatch) => {
  dispatch({ type: PAYMENT_STATUS_REQUEST_PENDING, payload: null });

  if (status) {
    dispatch({
      type: PAYMENT_STATUS_REQUEST_SUCCESS,
      payload: status,
    });
  } else {
    dispatch({
      type: PAYMENT_STATUS_REQUEST_FAILED,
      payload: null,
    });
  }
};
