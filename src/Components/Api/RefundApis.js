import Endpoint from "../../Utils/Endpoint";
import BanglaBazarApi from "./BanglaBazarApi";

export class RefundApis {
  refundDetailsByOrderNumber = async (order_number, status, type) => {
    var data = {
      status, type
    };
    return new Promise((resolve, reject) => {
      BanglaBazarApi.post(
        `${Endpoint}/api/payment/refund-order/${order_number}`,
        data
      )
        .then(resolve)
        .catch(reject);
    });
  };

  refundNotifyUserAndVendors = async (data) => {
    return new Promise((resolve, reject) => {
      BanglaBazarApi.post(`${Endpoint}/api/payment/refund-notification`, data)
        .then(resolve)
        .catch(reject);
    });
  };
  assignOrderForDelivery = async (data) => {
    return new Promise((resolve, reject) => {
      BanglaBazarApi.post(`${Endpoint}/api/admin/assign-ro-notification`, data)
        .then(resolve)
        .catch(reject);
    });
  };
  assignRefundOrder = async (data) => {
    return new Promise((resolve, reject) => {
      BanglaBazarApi.post(`${Endpoint}/api/admin/assign-ro`, data)
        .then(resolve)
        .catch(reject);
    });
  };
  assignRefundOrderUSA = async (data) => {
    return new Promise((resolve, reject) => {
      BanglaBazarApi.post(`${Endpoint}/api/admin/assign-ro-usa`, data)
        .then(resolve)
        .catch(reject);
    });
  };
}


