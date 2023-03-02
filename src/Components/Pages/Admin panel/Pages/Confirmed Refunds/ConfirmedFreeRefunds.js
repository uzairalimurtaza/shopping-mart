import { useEffect, useState } from "react";
import firetoast from "./../../../../../Helpers/FireToast";
import axios from "axios";
import Endpoint from "./../../../../../Utils/Endpoint";
import { useParams, useHistory } from "react-router-dom";
import noRequest from "../../../../../assets/images/no-request.svg";
import BanglaBazarApi from "./../../../../Api/BanglaBazarApi";
import moment from "moment";
import { RequiredField } from "../../../../../Utils/Required-field";
import CsvDownload from "react-json-to-csv";
import {
    Modal,
    ModalFooter,
    ModalBody,

} from "reactstrap";
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";
import { Button } from "reactstrap";

function ConfirmedFreeRefunds() {
    const [RefundRequests, setRefundRequests] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [Payments, setPayments] = useState([]);
    const [paginate, setPaginate] = useState({
        offset: "0",
        limit: "5",
        search: "",
        sort: "DESC",
        status: "Processing",
    })
    const [ConfirmationModal, setConfirmationModal] = useState(false);
    const [initiatedOrder, setInitatedOrder] = useState(null);
    const [paymentImage, setPaymentImage] = useState(null);
    const [selectedOrderNumber, setSelectedOrderNumber] = useState(false);

    const { type } = useParams();

    var history = useHistory();
    var getPayments = async () => {
        setIsLoading(true);
        var data = { ...paginate };
        // data["search"] = search;
        // data["sort"] = sort;
        try {
            const response = await BanglaBazarApi.post(
                `${Endpoint}/api/admin/getConfirm-ro-free`,
                data
            );
            setRefundRequests(response.data.orderDetails);
            setTotalRecords(response.data.total_records);
            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
            console.log(e);
            firetoast("Something went wrong!", "error", 3000, "top-right");
        }
    };
    var getRecordsFiltered = async (order) => {
        setIsLoading(true);
        var filter = {
            ...paginate,
        };
        filter.search = "";
        filter.sort = order;
        try {
            const response = await BanglaBazarApi.post(
                `${Endpoint}/api/admin/getConfirm-ro-free`,
                filter
            );
            setRefundRequests(response.data.orderDetails);
            setTotalRecords(response.data.total_records);
            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
            console.log(e);
            firetoast("Something went wrong!", "error", 3000, "top-right");
        }
    };
    var paginateData = (goTo) => {
        var offset = parseInt(paginate.offset) + 1;
        var numOfPages = Math.ceil(totalRecords / offset);
        console.log(offset, numOfPages);
        if (goTo === "next") {
            if (offset < numOfPages) {
                paginate.offset = paginate.offset + 1;
                // //console.log(paginate)
                setPaginate(paginate);

                getPayments();
            }
        } else if (goTo === "previous") {
            //console.log("previous");
            if (paginate.offset > 0) {
                paginate.offset = paginate.offset - 1;
                // //console.log(paginate)
                setPaginate(paginate);
                getPayments();
            }
        }
    };
    var getRefundByOrderNumber = async (number) => {
        setIsLoading(true);
        var filter = {
            ...paginate,
        };
        filter.search = number;
        filter.sort = "DESC";
        try {
            const response = await BanglaBazarApi.post(
                `${Endpoint}/api/admin/getConfirm-ro-free`,
                filter
            );
            setRefundRequests(response.data.orderDetails);
            setTotalRecords(response.data.total_records);
            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
            console.log(e);
            firetoast("Something went wrong!", "error", 3000, "top-right");
        }
    };
    var generateRefund = async (Order) => {
        console.log(Order);
        var form = new FormData();
        try {
            var response;
            if (Order?.ProductDetail[0].PaymentType === "cod") {
                form.append("AccountNo", Order?.ProductDetail[0]?.AccountNumber);
                form.append("OrderNumber", selectedOrderNumber);
                form.append("RefundCodDepositProof", paymentImage);
                for (let i = 0; i < Order.ProductDetail.length; i++) {
                    form.append(
                        `ProcessOrderIDs[${i}]`,
                        Order.ProductDetail[i].ProcessOrderID
                    );
                }
                response = await BanglaBazarApi.post(
                    `${Endpoint}/api/admin/cod-refund`,
                    form
                );
            } else {
                response = await BanglaBazarApi.post(
                    `${Endpoint}/api/sslCommerz/bank-refund/${selectedOrderNumber}`,
                    {
                        ProcessOrderIDs: Order?.ProductDetail?.map(
                            (val) => val.ProcessOrderID
                        ),
                        type: type
                    }
                );
            }
            if (response.data.status) {
                firetoast(
                    `Refund has been generated for OrderNumber ${selectedOrderNumber}`,
                    "success",
                    3000,
                    "top-center"
                );
                setTimeout(() => {
                    setConfirmationModal(false);
                }, 2000);
            } else {
                firetoast(
                    "This was some problem with generating refund",
                    "default-error"
                );
                setTimeout(() => {
                    setConfirmationModal(false);
                }, 2000);
            }
        } catch (e) {
            console.log(e);
            firetoast("Something went wrong!", "default-error");
        }
    };

    useEffect(() => {
        getPayments();
    }, []);


    return (
        <div className="card">
            <div
                className="card-header bg-white"
                style={{ borderBottom: "1px solid white" }}
            >
                {/* <h5 className="ftw-400 text-default mt-2 mb-2">Paid Return Refund Requests</h5> */}
            </div>
            <div className="d-flex align-items-center">
                <h5 className="text-default" style={{ marginLeft: "15px" }}
                >Search</h5>
                <button
                    className="btn btn-success "
                    style={{ marginLeft: "20px" }}
                    onClick={() => {
                        document.getElementById("SearchName").value = "";
                        //getPayments();
                    }}
                >
                    Clear{" "}
                </button>
            </div>
            <div className="row m-0 mt-2">
                <div className="col-4">
                    <div className="form-group row">
                        <div className="col-sm-12">
                            <div className="input-group mb-3">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Search By Order#"
                                    id="SearchName"
                                />
                                <div className="input-group-append">
                                    <button
                                        className="btn btn-success"
                                        style={{ padding: "9px 12px" }}
                                        onClick={async () => {
                                            var elmntVal =
                                                document.getElementById("SearchName").value;

                                            await getRefundByOrderNumber(elmntVal);
                                        }}
                                    >
                                        <i className="fas fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="d-flex justify-content-between mt-4">
                <div>
                    <h6 style={{ marginLeft: "14px" }}>
                        Total Refunds Requests :{" "}
                        <span className="text-default">{totalRecords}</span>
                    </h6>
                </div>
                <div className="d-flex justify-content-between">
                    <div
                        className="btn-group btn-left-padding"
                        role="group"
                        aria-label="Basic example"
                    >
                        <button
                            className="btn btn-light btn-sm text-default"
                            type="button"
                            onClick={() => paginateData("previous")}
                        >
                            <i className="fa fa-arrow-left"></i>
                        </button>
                        <button className="btn btn-light btn-sm" type="button">
                            {parseInt(paginate.offset) + 1}
                        </button>
                        <button
                            className="btn btn-light btn-sm text-default"
                            type="button"
                            data-bs-original-title=""
                            title=""
                            onClick={() => paginateData("next")}
                        >
                            <i className="fa fa-arrow-right"></i>
                        </button>
                    </div>

                    <UncontrolledDropdown>
                        <DropdownToggle
                            className="text-secondary"
                            style={{ backgroundColor: "white", border: "white" }}
                        >
                            <i className="fas fa-sort-amount-down-alt text-dark"></i>{" "}
                            Filter by
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem
                                onClick={() => {
                                    getRecordsFiltered("ASC");
                                }}
                            >
                                Ascending
                            </DropdownItem>
                            <DropdownItem
                                onClick={() => {
                                    getRecordsFiltered("DESC");
                                }}
                            >
                                Descending
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <CsvDownload
                        data={Payments}
                        filename="refund-request.csv"
                        className="btn btn-default-outline ml-2"
                        style={{ marginRight: "5px" }}
                    >
                        Export <i className="fas fa-arrow-alt-to-bottom"></i>
                    </CsvDownload>
                </div>
            </div>
            <div className="card-body">
                {RefundRequests.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-borderless">
                            <thead>
                                <tr>
                                    <th>Order Number</th>
                                    <th>Order Date</th>
                                    <th>Total Products</th>
                                    <th>Product Return</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {RefundRequests.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.OrderNumber}</td>
                                        <td>{moment(item.OrderDate).format("DD-MM-YYYY")}</td>
                                        <td>{item.ProductDetail.length}</td>
                                        <td>Paid</td>
                                        <td></td>
                                        <td>
                                            <button
                                                className="btn btn-success btn-sm"
                                                // onClick={() => initRefund(item.OrderNumber)}
                                                onClick={() =>
                                                    history.push(
                                                        `/panel/admin/refund-details/${item.OrderNumber}/Processing/Y`
                                                    )
                                                }
                                            >
                                                View
                                            </button>
                                        </td>
                                        <td className="pt-20">
                                            {" "}
                                            <>
                                                <span
                                                    className="btn btn-defaul bg-light"
                                                    style={{ fontSize: "13px", cursor: "pointer" }}
                                                    onClick={() => {
                                                        setSelectedOrderNumber(item.OrderNumber);
                                                        setConfirmationModal(!ConfirmationModal);
                                                        setInitatedOrder(item);
                                                    }}
                                                >
                                                    {" "}
                                                    Init Refund
                                                </span>
                                            </>
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
            <Modal
                isOpen={ConfirmationModal}
                toggle={() => setConfirmationModal(!ConfirmationModal)}
            >
                {/* <ModalHeader toggle={() => setConfirmationModal(!ConfirmationModal)}>
          Alert
        </ModalHeader> */}
                <ModalBody>
                    <h4>
                        Do you want to continue with generating refund for this order ?
                    </h4>
                    {initiatedOrder?.ProductDetail[0]?.PaymentType === "cod" && (
                        <div>
                            <label>
                                Payment Deposit Proof <RequiredField />
                            </label>
                            <input
                                className="form-control"
                                name="paymentImage"
                                type="file"
                                onChange={(e) =>
                                    setPaymentImage(e.target.files[0] ? e.target.files[0] : null)
                                }
                            />
                        </div>
                    )}
                </ModalBody>
                <ModalFooter style={{ padding: "5px" }}>
                    <Button
                        color="default"
                        onClick={() => generateRefund(initiatedOrder)}
                        disabled={
                            initiatedOrder?.ProductDetail[0]?.PaymentType === "cod" &&
                            !paymentImage
                        }
                    >
                        Generate
                    </Button>{" "}
                    <Button onClick={() => setConfirmationModal(false)}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}
export default ConfirmedFreeRefunds;
