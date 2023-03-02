import { useEffect, useState } from "react";
import firetoast from "./../../../../../Helpers/FireToast";
import axios from "axios";
import Endpoint from "./../../../../../Utils/Endpoint";
import { useHistory } from "react-router-dom";
import noRequest from "../../../../../assets/images/no-request.svg";
import BanglaBazarApi from "./../../../../Api/BanglaBazarApi";
import moment from "moment";
function PaidRefundRequestTable() {
    const [RefundRequests, setRefundRequests] = useState([]);
    var history = useHistory();
    useEffect(() => {
        getRefunds();
    }, []);
    var getRefunds = async () => {
        try {
            var response = await BanglaBazarApi.post(
                `${Endpoint}/api/admin/refund-details-paid`,
                {
                    offset: "0",
                    limit: "5",
                    search: "",
                    sort: "DESC",
                    status: "Initiated",
                }
            );
            setRefundRequests(response.data.orderDetails);
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
                <h5 className="ftw-400 text-default mt-2 mb-2">Paid Return Refund Requests</h5>
            </div>
            <div className="card-body">
                {console.log(RefundRequests, "RefundRequest")}
                {RefundRequests.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-borderless">
                            <thead>
                                <tr>
                                    <th>Order Number</th>
                                    <th>Order Date</th>
                                    <th>Total Products</th>
                                    <th>Product Return</th>
                                    <th>Refund Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {RefundRequests.map((item, index) => (
                                    <tr tr key={index} >
                                        <td>{item.OrderNumber}</td>
                                        <td>{moment(item.OrderDate).format("DD-MM-YYYY")}</td>
                                        <td>{item.ProductDetail.length}</td>
                                        <td>Paid</td>
                                        <td>Initiated</td>
                                        <td>
                                            <button
                                                className="btn btn-success btn-sm"
                                                // onClick={() => initRefund(item.OrderNumber)}
                                                onClick={() =>
                                                    history.push(
                                                        `/panel/admin/refund-details/${item.OrderNumber}/Initiated/N`
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
        </div >
    );
}
export default PaidRefundRequestTable;
