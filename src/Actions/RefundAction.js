import { RefundApis } from "../Components/Api/RefundApis";
import {
  GET_REFUND_BY_ORDER_NUMBER,
  GENERATE_NOTIFICATION_FOR_VENDOR_USER,
} from "../Constants/Constants";
import firetoast from "../Helpers/FireToast";
var refundApis = new RefundApis();

export const getRefundByOrderNumber =
  (order_number, status, type, cb) => async (dispatch) => {
    try {
      const { data } = await refundApis.refundDetailsByOrderNumber(
        order_number,
        status,
        type
      );
      dispatch({
        type: GET_REFUND_BY_ORDER_NUMBER,
        payload: data,
      });
      cb(data);
    } catch (error) {
      console.log(error);
      cb(error);
    }
  };
export const NotifyUserAndVendors = (details, cb) => async (dispatch) => {
  try {
    const { data } = await refundApis.refundNotifyUserAndVendors(details);
    dispatch({
      type: GENERATE_NOTIFICATION_FOR_VENDOR_USER,
      payload: data,
    });
    cb(data);
  } catch (error) {
    firetoast(
      "Something went wrong while notifing user and vendors",
      "default-error"
    );
    cb(error);
  }
};
export const assignOrderForDelivery = (details, cb) => async () => {
  try {
    const { data } = await refundApis.assignOrderForDelivery(details);
    cb(data);
  } catch (error) {
    firetoast(
      "Something went wrong while notifing user and vendors",
      "default-error"
    );
    cb(error);
  }
};
export const assignRefundOrder = (details, cb) => async () => {
  try {
    const { data } = await refundApis.assignRefundOrder(details);
    cb(data);
  } catch (error) {
    firetoast(
      "Something went wrong while notifing user and vendors",
      "default-error"
    );
    cb(error);
  }
};
export const assignRefundOrderUSA = (details, cb) => async () => {
  try {
    const { data } = await refundApis.assignRefundOrderUSA(details);
    cb(data);
  } catch (error) {
    firetoast(
      "Something went wrong while notifing user and vendors",
      "default-error"
    );
    cb(error);
  }
};
