import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import firetoast from "../../../../../Helpers/FireToast";
import Endpoint from "../../../../../Utils/Endpoint";
import Loading from "../../../../../Utils/Loading";
import BanglaBazarApi from "../../../../Api/BanglaBazarApi";
import moment from "moment";
export function VendorPaymentHistory() {
  const [records, setRecords] = useState([]);
  const [isLoading, setLoading] = useState(false);
  var { vendorId } = useParams();
  useEffect(() => {
    getRecords();
  }, []);
  var getRecords = async () => {
    setLoading(true);
    try {
      const response = await BanglaBazarApi.get(
        `${Endpoint}/api/admin/get-paymentDetails/${vendorId}`
      );

      if (response.data.status) {
        setLoading(false);

        setRecords(response.data.vendorPaymentDetail);
      } else {
        setLoading(false);

        var { message, error } = response.data;
        firetoast(message || error, "default-error");
      }
    } catch (e) {
      console.log(e);
      setLoading(false);

      firetoast("Something went wrong", "default-error");
    }
  };
  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between">
        <h3 className="ftw-400">
          <Link to="/panel/search/pay-to-vendor">
            <i class="fas fa-chevron-circle-left text-dark"></i>
          </Link>
          Payment Records
        </h3>
      </div>
      <div className="card mt-2">
        <div className="card-body">
          <div>
            <div className="mt-3 table-responsive">
              {isLoading ? (
                <Loading />
              ) : (
                <table className="table table-bordered">
                  <thead>
                    <th>Order Number</th>
                    <th>Product Name</th>
                    <th>Item Price</th>
                    <th>Commission Rate</th>
                    <th>Vendor Payment Amount</th>
                    <th>BanglaBazar Payment Amount</th>
                    <th>Payment Date</th>
                    <th></th>
                  </thead>
                  <tbody>
                    {records.map((record, index) => (
                      <tr key={index}>
                        <td className="pt-18">{record.OrderNumber}</td>
                        <td className="pt-18">{record.Title}</td>
                        <td className="pt-18">{record.ItemsPrice}</td>
                        <td className="pt-18">{record.CommissionRate}</td>
                        <td className="pt-18">{record.VendorPaymentAmount}</td>
                        <td className="pt-18">{record.AdminPaymentAmount}</td>
                        <td className="pt-18">
                          {moment(record.ProcessDate).format("DD-MM-YYYY")}
                        </td>
                        <td className="pt-18">
                          <Link
                            to="#"
                            className="td-none text-default"
                            onClick={() =>
                              window.open(
                                `${Endpoint}/${record.PaymentConfirmation}`,
                                "_blank"
                              )
                            }
                          >
                            View Document
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
}
