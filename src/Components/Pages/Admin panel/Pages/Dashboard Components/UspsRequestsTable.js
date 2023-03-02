import { useEffect, useState } from "react";
import Endpoint from "./../../../../../Utils/Endpoint";
import { useHistory } from "react-router-dom";
import noRequest from "../../../../../assets/images/no-request.svg";
import BanglaBazarApi from "./../../../../Api/BanglaBazarApi";
import moment from "moment";
function UspsRequestTable() {
  const [UspsRequests, setUspsRequests] = useState([]);
  var history = useHistory();
  useEffect(() => {
    getRefunds();
  }, []);
  var getRefunds = async () => {
    try {
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/usps/get-uspsOrders`,
        {
          offset: "0",
          limit: "5",
        }
      );
      setUspsRequests(response.data.orderDetails);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="card">
      <div
        className="card-header bg-white"
        style={{ borderBottom: "1px solid white" }}
      >
        <h5 className="ftw-400 text-default mt-2 mb-2">USPS Requests</h5>
      </div>
      <div className="card-body">
        {UspsRequests.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-borderless">
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Order Date</th>
                  <th>Transaction Id</th>
                  <th>Total Products</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {UspsRequests.map((item, index) => (
                  <tr key={index}>
                    <td>{item.OrderNumber}</td>
                    <td>{moment(item.OrderDate).format("DD-MM-YYYY")}</td>
                    <td>{item.TransactionID}</td>
                    <td>{item.ProductDetail.length}</td>

                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        // onClick={() => initRefund(item.OrderNumber)}
                        onClick={() =>
                          history.push(
                            `/panel/usps-order-management/${item.OrderNumber}`
                          )
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center">
            <img
              src={noRequest}
              className="img-fluid"
              style={{ height: "130px" }}
            />
            <h5 className="mt-2 ftw-400 text-default">No Pending Requests</h5>
          </div>
        )}
      </div>
    </div>
  );
}
export default UspsRequestTable;
