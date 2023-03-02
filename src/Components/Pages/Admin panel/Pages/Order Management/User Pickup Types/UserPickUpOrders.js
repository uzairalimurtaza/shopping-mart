import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import NoStore from "../../../../../../assets/images/no-store.svg";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import CsvDownload from "react-json-to-csv";
import moment from "moment";
import firetoast from "./../../../../../../Helpers/FireToast";
import Endpoint from "./../../../../../../Utils/Endpoint";
import BanglaBazarApi from "./../../../../../Api/BanglaBazarApi";
import Loading from "./../../../../../../Utils/Loading";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
function UserPickUpOrders({ ActiveTab }) {
  const history = useHistory();
  const [sort, setSort] = useState("DESC");
  const [paginate, setPaginate] = useState({
    offset: 0,
    limit: 5,
    sort: "DESC",
  });
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [Orders, setOrders] = useState([]);
  const [OpenModal, setOpenModal] = useState(false);
  const [SelectedOrder, setSelectedOrder] = useState(null);
  const [OpenDeliveryModal, setOpenDeliveryModal] = useState(false);
  const [UploadedImage, setUploadedImage] = useState(null);
  var paginateData = (goTo) => {
    //console.log("called");
    var offset = paginate.offset + 1;
    var numOfPages = Math.ceil(totalRecords / offset);
    console.log(offset, numOfPages);
    if (goTo === "next") {
      if (offset < numOfPages) {
        console.log(offset, numOfPages);
        paginate.offset = paginate.offset + 1;
        // //console.log(paginate)
        setPaginate(paginate);

        getOrders();
      }
    } else if (goTo === "previous") {
      //console.log("previous");
      if (paginate.offset > 0) {
        paginate.offset = paginate.offset - 1;
        // //console.log(paginate)
        setPaginate(paginate);
        getOrders();
      }
    }
  };
  var getOrders = async (temp) => {
    setIsLoading(true);
    var response = "";
    var data = { ...temp };
    data["search"] = search;
    data["sort"] = sort;
    try {
      response = await BanglaBazarApi.post(
        `${Endpoint}/api/admin/getOrdersByStatus`,
        data
      );

      setOrders(response.data.orderDetails);
      setTotalRecords(response.data.total_records);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
      firetoast("Something went wrong!", "error", 3000, "top-right");
    }
  };
  var getOrdersByOrderNumber = async (orderNumber) => {
    setIsLoading(true);
    var response = "";
    var data = paginate;
    data["search"] = orderNumber;
    data["sort"] = sort;

    try {
      response = await BanglaBazarApi.post(
        `${Endpoint}/api/admin/getOrdersByStatus`,
        data
      );

      setOrders(response.data.orderDetails);
      setTotalRecords(response.data.total_records);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
      firetoast("Something went wrong!", "error", 3000, "top-right");
    }
  };

  useEffect(() => {
    var temp = {
      offset: 0,
      limit: 5,
      sort: "DESC",
      ReadyPickupForAdmin: "N",
      ReadyPickupForUser: "Y",
    };
    if (ActiveTab === "2") {
      temp["status"] = "Assigned";
    }
    if (ActiveTab === "3") {
      temp["status"] = "Delivered";
    }

    setPaginate(temp);
    getOrders(temp);
  }, [ActiveTab]);
  let ChangeStatus = async (order, status) => {
    console.log(order);
    //vendor/pathao 1
    //pickup 2
    //
    var data = {
      OrderNumber: order.OrderNumber,
      ConsignmentId: order.ConsignmentId,
      type: "2",
      status: status,
      DeliveryDriverID: order.DeliveryDriverID,
    };

    try {
      const response = await BanglaBazarApi.post(
        `${Endpoint}/api/courier/return-pickupStatus`,
        data
      );
      if (response.data.status) {
        firetoast("Order Status Updated!", "success", 2000, "top-right");
        getOrders(paginate);
      } else {
        const { message, error } = response.data;
        firetoast(message || error, "default-error");
      }
    } catch (e) {
      firetoast(
        "Something went wrong while changing order status",
        "default-error"
      );
    }
  };
  let handleChangeStatus = async () => {
    var data = new FormData();
    data.append("OrderNumber", SelectedOrder.OrderNumber);
    data.append("status", "Delivered");
    data.append("DeliveryConfirmationPic", UploadedImage);
    try {
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/courier/delivered-pickupStatus`,
        data
      );

      if (response.data.status) {
        firetoast(
          "Order Status set to delivered!",
          "success",
          3000,
          "top-center"
        );
        setSelectedOrder(null);
        setUploadedImage(null);
        setOpenDeliveryModal(false);
        getOrders(paginate);
      } else {
        firetoast(
          response.data.error || response.data.message,
          "default-error"
        );
      }
    } catch (e) {
      console.log(e);
    }
  };
  var handleFileUpload = (e) => {
    if (e.target.files[0]) {
      setUploadedImage(e.target.files[0]);
    }
  };
  return (
    <>
      <div className="card mt-2">
        <div className="card-body">
          <div className="d-flex justify-content-between mt-4">
            <div>
              <h6>
                Total Orders :{" "}
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
                  {paginate.offset + 1}
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
                  style={{
                    backgroundColor: "white",
                    border: "white",
                    color: "black",
                  }}
                >
                  {" "}
                  <i className="fas fa-sort-amount-down-alt text-dark"></i>{" "}
                  Filter
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={async () => {
                      await setSort("ASC");
                      getOrders();
                    }}
                  >
                    Ascending
                  </DropdownItem>

                  <DropdownItem
                    onClick={async () => {
                      await setSort("DESC");
                      getOrders();
                    }}
                  >
                    Descending
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <CsvDownload
                data={Orders}
                filename="products.csv"
                className="btn btn-default-outline"
              >
                Export <i className="fas fa-arrow-alt-to-bottom"></i>
              </CsvDownload>
            </div>
          </div>
          <div>
            <div className="d-flex align-items-center mb-3">
              <h6
                className="ftw-400 text-default"
                style={{ marginRight: "10px" }}
              >
                Search
              </h6>
              <div className="col-3">
                <button
                  className="btn btn-success"
                  onClick={() => {
                    document.getElementById("AdminOrderAssigned").value = "";
                    getOrdersByOrderNumber("");
                  }}
                >
                  Clear{" "}
                </button>
              </div>
            </div>
            <div className="row m-0">
              <div className="col-4">
                <div className="form-group row">
                  {/* <label for="staticEmail" className="col-sm-4 col-form-label">
                    By Name :
                  </label> */}
                  <div className="col-sm-12">
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="AdminOrderAssigned"
                        placeholder="By Order Number"
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-success"
                          style={{ padding: "9px 12px" }}
                          onClick={async () => {
                            var elmntVal =
                              document.getElementById(
                                "AdminOrderAssigned"
                              ).value;
                            getOrdersByOrderNumber(elmntVal);
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
          </div>

          <div className="mt-3 table-responsive">
            {isLoading ? (
              <div>
                <Loading />
              </div>
            ) : Orders.length > 0 ? (
              <table className="table table-borderless" id="myTable">
                <thead>
                  <tr>
                    <th>Order Number</th>
                    <th>Transaction Id</th>
                    <th>Order Date</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {Orders.map((order, index) => (
                    <tr key={index}>
                      <td className="pt-18">{order.OrderNumber}</td>
                      <td className="pt-18">{order.TransactionID}</td>
                      <td className="pt-18">
                        {moment(order.OrderDate).format("DD/MM/YYYY")}
                      </td>

                      <td className="pt-18">
                        {ActiveTab === "2" && (
                          <button
                            className="btn btn-sm btn-warning text-white"
                            // onClick={() => ChangeStatus(order, "Delivered")}
                            onClick={() => {
                              setSelectedOrder(order);
                              setOpenDeliveryModal(!OpenDeliveryModal);
                            }}
                          >
                            Mark as Delivered
                          </button>
                        )}

                        {ActiveTab === "3" && (
                          <span
                            className="badge badge-success bg-success text-white"
                            style={{ fontSize: "10px" }}
                          >
                            Delivered
                          </span>
                        )}
                      </td>

                      <td className="pt-18">
                        {" "}
                        <Link
                          className="text-default td-none"
                          to={`/panel/order-management/${order.OrderNumber}/user`}
                        >
                          {" "}
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center no-store-container ">
                <div className="mt-3">
                  <img src={NoStore} className="img-fluid no-store-img " />
                  <h2 className="ftw-400 mt-3">No Products Data Found </h2>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={OpenDeliveryModal}
        toggle={() => setOpenDeliveryModal(!OpenDeliveryModal)}
      >
        <ModalHeader toggle={() => setOpenDeliveryModal(!OpenDeliveryModal)}>
          Delivery Confirmation
        </ModalHeader>
        <ModalBody>
          <h5>
            Please upload the delivery form signed by user to mark order
            delivery
          </h5>
          <input type="file" onChange={(e) => handleFileUpload(e)} />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => handleChangeStatus()}>
            Update
          </Button>{" "}
          <Button
            onClick={() => {
              setSelectedOrder(null);
              setUploadedImage(null);
              setOpenDeliveryModal(false);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
export default UserPickUpOrders;
