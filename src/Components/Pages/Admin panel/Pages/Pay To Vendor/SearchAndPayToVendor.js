import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import NoStore from "../../../../../assets/images/no-store.svg";
import CsvDownload from "react-json-to-csv";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
// import UserTableAction from "./UserTableAction";
import Endpoint from "../../../../../Utils/Endpoint";
import Loading from "../../../../../Utils/Loading";
import CapitalizeFirstWord from "../../../../../Utils/CapitalizeFirstWord";
import moment from "moment";
import PhoneInput from "react-phone-input-2";
import CheckEmpty from "../../../../../Utils/CheckEmpty";
import { CountryCodes } from "../../../../../Helpers/CountryCodes";
import firetoast from "../../../../../Helpers/FireToast";
import BanglaBazarApi from "../../../../Api/BanglaBazarApi";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
export function SearchAndPayToVendor() {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [modal2, setModal2] = useState(false);
  const toggle2 = () => setModal2(!modal2);
  const history = useHistory();
  const [records, setRecords] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [vendorOrders, setVendorOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [OrderBeingPaid, setOrderBeingPaid] = useState([]);
  const [PaymentDocument, setPaymentDocument] = useState(null);
  const [SearchId, setSearchId] = useState(null);
  const [TotalAmount, setTotalAmount] = useState(0);
  var handleAllChecked = (status) => {
    var temp = [];
    if (status) {
      for (let i = 0; i < vendorOrders.length; i++) {
        temp.push(true);
      }
      setSelectedOrders(temp);
    } else {
      for (let i = 0; i < vendorOrders.length; i++) {
        temp.push(false);
      }
      setSelectedOrders(temp);
    }
  };
  var handleSingleChecked = (val, index) => {
    var temp = [...selectedOrders];
    temp[index] = val;
    setSelectedOrders(temp);
  };
  var getRecords = async (keyword) => {
    setIsLoading(true);
    try {
      const response = await BanglaBazarApi.post(
        `${Endpoint}/api/admin/vendor-details`,
        {
          search: keyword,
        }
      );
      setRecords(response.data.getVendorBusiness);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };
  var getVendorsOrders = async (_vendorID) => {
    setIsLoading(true);
    var temp = [];
    try {
      const response = await BanglaBazarApi.get(
        `${Endpoint}/api/admin/vendorPaymentOrders/${_vendorID}`
      );
      setVendorOrders(response.data.orderDetails);
      setIsLoading(false);
      toggle();
      for (let i = 0; i < vendorOrders.length; i++) {
        temp.push(false);
      }
      setSelectedOrders(temp);
    } catch (e) {
      setIsLoading(false);
      //  console.log(e);
      firetoast("Something went wrong", "default-error");
    }
  };
  var PaySelected = () => {
    var selectedObjectes = [];
    var total = 0;
    for (let i = 0; i < selectedOrders.length; i++) {
      if (selectedOrders[i] === true) {
        var current = vendorOrders[i];
        total += parseFloat(current.VendorPaymentAmount);
        var _obj = {
          ProcessOrderID: current.ProcessOrderID,
          CommissionRate: current.CommissionRate,
          VendorPaymentAmount: current.VendorPaymentAmount,
          AdminPaymentAmount: current.BanglaBazarPaymentAmount,
          ProcessDate: current.DeliveryDate,
        };
        selectedObjectes.push(_obj);
      }
    }
    if (selectedObjectes.length === 0) {
      return firetoast(
        "Please select atleast one order to continue!",
        "default-error"
      );
    }
    setOrderBeingPaid(selectedObjectes);
    setTotalAmount(total);
    toggle2();
  };
  let handleUpload = (e) => {
    if (e.target.files[0]) {
      setPaymentDocument(e.target.files[0]);
    }
  };
  var UpdateOrderStatus = async () => {
    var form = new FormData();
    // console.log(JSON.stringify(OrderBeingPaid));
    form.append("VendorPaymentDetails", JSON.stringify(OrderBeingPaid));
    form.append("PaymentConfirmation", PaymentDocument);

    try {
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/admin/add-vendorPayment`,
        form
      );
      if (response.data.status) {
        firetoast(
          "Record Updated Successfully!",
          "success",
          3000,
          "top-center"
        );
        toggle2();

        toggle();
        getRecords(SearchId);
      } else {
        var { message, error } = response.data;
        firetoast(message || error, "default-error");
      }
    } catch (e) {
      firetoast("Something went wrong", "default-error");
      console.log(e);
    }
  };
  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between">
        <h3 className="ftw-400">
          <Link to="/panel/pay-to-vendor">
            <i class="fas fa-chevron-circle-left text-dark"></i>
          </Link>
          {"  "} Pay To Vendor - Search
        </h3>
      </div>
      <div className="card mt-2">
        <div className="card-body">
          <div>
            <div className="d-flex align-items-center">
              <h6 className="ftw-400 text-default">Search</h6>
              <button
                className="btn btn-success"
                style={{ marginLeft: "10px" }}
                onClick={() => {
                  document.getElementById("SearchName").value = "";
                  setRecords([]);
                }}
              >
                Clear{" "}
              </button>
            </div>

            <div className="row mt-3 ">
              <div className="col-8 m-auto">
                <div className="form-group row">
                  <div className="col-sm-12">
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="SearchName"
                        placeholder="Search by Vendor Name"
                        //     onChange={async (e) => {

                        //     }}
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-success"
                          style={{ padding: "9px 12px" }}
                          onClick={async () => {
                            var elmntVal =
                              document.getElementById("SearchName").value;
                            await getRecords(elmntVal);
                            setSearchId(elmntVal);
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
            <div className="mt-3 table-responsive">
              {isLoading ? (
                <div>
                  <Loading />
                </div>
              ) : records && records.length > 0 ? (
                <table className="table table-borderless" id="myTable">
                  <thead>
                    <tr>
                      <th>Vendor Name </th>
                      <th>Business Name</th>
                      <th>Contact</th>
                      <th>Email</th>
                      <th>Country</th>
                      <th>Total Store Locations</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {records &&
                      records.length > 0 &&
                      records.map((record, index) => (
                        <tr key={index}>
                          <td className="pt-18">{record.VendorName}</td>
                          <td className="pt-18">{record.CompanyName}</td>
                          <td className="pt-18">{record.BusinessPhone}</td>
                          <td className="pt-18">{record.BusinessEmail}</td>
                          <td className="pt-18">{record.Country}</td>
                          <td className="pt-18">{record.Total_Stores}</td>
                          <td className="text-center pt-18 text-center">
                            <div className="btn-group">
                              <button
                                className="btn btn-success"
                                onClick={() =>
                                  history.push(
                                    `/panel/viewBusiness/${record.VendorID}`
                                  )
                                }
                              >
                                Profile
                              </button>
                              <button
                                to="#"
                                className="btn btn-warning"
                                onClick={() =>
                                  getVendorsOrders(record.VendorID)
                                }
                              >
                                Orders
                              </button>
                              <button
                                className="btn btn-light"
                                onClick={() =>
                                  history.push(
                                    `/panel/vendor-payments/${record.VendorID}`
                                  )
                                }
                              >
                                Payments
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                records && (
                  <>
                    {" "}
                    <div className="text-center no-store-container ">
                      <div className="mt-3">
                        <img
                          src={NoStore}
                          className="img-fluid no-store-img "
                        />
                        <h2 className="ftw-400 mt-3">No Vendor Found </h2>
                      </div>
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        <Modal
          isOpen={modal}
          toggle={toggle}
          size="xl"
          centered
          backdrop={"static"}
        >
          <ModalHeader toggle={toggle}>Vendor Orders</ModalHeader>
          <ModalBody>
            <div className="table-responsive">
              <table className="table table-borderless" id="myTable">
                <thead>
                  <tr>
                    <th>
                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-check-input default-check-color"
                          checked={allSelected}
                          onChange={(e) => {
                            handleAllChecked(e.target.checked);
                            setAllSelected(e.target.checked);
                          }}
                        />{" "}
                        <div style={{ marginLeft: "5px", marginTop: "4px" }}>
                          All
                        </div>
                      </div>
                    </th>
                    <th>Order Number</th>
                    <th style={{ width: "15%" }}>Product Name</th>
                    <th>Price</th>
                    <th>Delivery Status</th>
                    <th>Purchase Date</th>
                    <th>Refund Date</th>
                    <th>Delivery Date</th>
                    <th>Shipping Cost BanglaBazar</th>
                    <th>Shipping Cost Vendor</th>
                    <th>Commission Rate</th>
                    <th>Amount After Commission</th>
                    <th>BanglaBazar Payment Amount</th>
                    <th>Vendor Payment Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vendorOrders &&
                    vendorOrders.length > 0 &&
                    vendorOrders.map((record, index) => (
                      <tr key={index}>
                        <td className="pt-18">
                          <input
                            className="form-check-input default-check-color"
                            type="checkbox"
                            onChange={(e) => {
                              handleSingleChecked(e.target.checked, index);
                              setAllSelected(false);
                            }}
                            checked={
                              selectedOrders[index] &&
                              selectedOrders[index] === true
                                ? true
                                : false
                            }
                          />
                        </td>
                        <td className="pt-18">{record.OrderNumber}</td>
                        <td className="pt-18">{record.Title}</td>
                        <td className="pt-18">{record.ItemsPrice}</td>
                        <td className="pt-18">
                          <span
                            class="badge badge-pill badge-success bg-default "
                            style={{ fontSize: "11px" }}
                          >
                            {" "}
                            {record.ProcessStatus}
                          </span>
                        </td>
                        <td className="pt-18">
                          {moment(record.OrderDate).format("DD/MM/YYYY")}
                        </td>
                        <td className="pt-18"></td>
                        <td className="pt-18">
                          {moment(record.DeliveryDate).format("DD/MM/YYYY")}
                        </td>
                        <td className="text-center pt-18 text-center">
                          {record.ShippingCostBanglabazar &&
                            record.ShippingCostBanglabazar}
                        </td>
                        <td className="text-center pt-18 text-center">
                          {record.ShippingCostVendor &&
                            record.ShippingCostVendor}
                        </td>

                        <td className="text-center pt-18 text-center">
                          {record.CommissionRate}
                        </td>
                        <td className="pt-18">
                          {record.AmountAfterCommission}
                        </td>
                        <td className="pt-18">
                          {record.BanglaBazarPaymentAmount}
                        </td>
                        <td className="pt-18">
                          {record.AmountAfterCommission}
                        </td>
                        <td className="pt-18">
                          <span
                            class="badge badge-pill badge-danger bg-danger "
                            style={{ fontSize: "11px" }}
                          >
                            {" "}
                            {record.VendorPaymentStatus === "Y" ? (
                              <span
                                class="badge badge-pill badge-success bg-default "
                                style={{ fontSize: "11px" }}
                              >
                                {" "}
                                Paid
                              </span>
                            ) : (
                              <span
                                class="badge badge-pill badge-danger bg-danger "
                                style={{ fontSize: "11px" }}
                              >
                                {" "}
                                Unpaid
                              </span>
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-default"
              onClick={() => {
                PaySelected();
              }}
            >
              Pay Selected
            </button>
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={modal2}
          toggle={toggle2}
          size="md"
          centered
          backdrop={"static"}
        >
          <ModalHeader toggle={toggle2}>Verification Document</ModalHeader>
          <ModalBody>
            <h5>
              Total amount paid is :{" "}
              <b className="text-default">{TotalAmount.toFixed(2)}</b>
            </h5>
            <form>
              <div class="form-group">
                <label for="exampleFormControlFile1">
                  Upload Payment Document <span className="text-danger">*</span>
                </label>
                <div>
                  <input
                    type="file"
                    className="form-control-file"
                    onChange={(e) => handleUpload(e)}
                  />
                </div>
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-success"
              onClick={() => UpdateOrderStatus()}
            >
              Update Record
            </button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}
