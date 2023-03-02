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
import { Link } from "react-router-dom";

export const PayToDriver = () => {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [Birthday, setBirthday] = useState("");
  const [Gender, setGender] = useState("male");
  const [phone_number, setPhoneNumber] = useState("");
  const [Customer, setCustomer] = useState("Y");
  const [Active, setActive] = useState("N");
  const [PaymentDocument, setPaymentDocument] = useState(null);
  const [paginate, setPaginate] = useState({
    offset: 0,
    limit: 5,
    sort: "DESC",
    search: "",
    status: "N",
  });
  const [disable, setDisable] = useState(false);
  const [CountryCode, setCountryCode] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  var [selectedOrder, SetSelectedOrder] = useState(null);
  const format =
    /(^(?!.*__.*)[a-z0-9]{2,253}(_?)[a-z0-9]+(?:\.[a-z0-9!#$%&*+\/=?^`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9]*[a-z0-9])?$)/gs;
  let getRecordsAndInit = async () => {
    setIsLoading(true);
    try {
      var form = new URLSearchParams();
      form.append("sort", paginate.sort);
      form.append("search", paginate.search);
      form.append("offset", paginate.offset);
      form.append("limit", paginate.limit);
      form.append("status", paginate.status);

      var resp = await BanglaBazarApi.post(
        `${Endpoint}/api/admin/driver-details`,
        form
      );

      setTotalRecords(resp.data.total_records);
      setRecords(resp.data.getDriverDetails);

      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };
  let getRecordsFiltered = async (val) => {
    setIsLoading(true);
    try {
      var form = new URLSearchParams();
      form.append("sort", val);
      form.append("search", paginate.search);
      form.append("offset", paginate.offset);
      form.append("limit", paginate.limit);
      form.append("status", paginate.status);

      var resp = await BanglaBazarApi.post(
        `${Endpoint}/api/admin/driver-details`,
        form
      );

      setTotalRecords(resp.data.total_records);
      setRecords(resp.data.getDriverDetails);

      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };
  let handleUpload = (e) => {
    if (e.target.files[0]) {
      setPaymentDocument(e.target.files[0]);
    }
  };
  useEffect(async () => {
    getRecordsAndInit();
  }, [paginate]);
  useEffect(async () => {
    setCountryCode(await CountryCodes());
  }, []);
  var setSelectedRecord = (record) => {
    SetSelectedOrder(record);
    toggle();
  };
  var getRecordsByBusiness = async (search) => {
    setIsLoading(true);
    try {
      var form = new URLSearchParams();
      form.append("sort", paginate.sort);
      form.append("search", search);
      form.append("offset", paginate.offset);
      form.append("limit", paginate.limit);
      form.append("status", paginate.status);

      var resp = await BanglaBazarApi.post(
        `${Endpoint}/api/admin/driver-details`,
        form
      );

      setTotalRecords(resp.data.total_records);
      setRecords(resp.data.getDriverDetails);

      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };
  var paginateData = (goTo) => {
    //console.log("called");
    var offset = Number(paginate["offset"] + 1);
    var numOfPages = Math.ceil(totalRecords / offset);

    if (goTo === "next") {
      if (offset + 1 < numOfPages) {
        console.log(offset, numOfPages);
        paginate.offset = paginate.offset + 1;
        // //console.log(paginate)
        setPaginate(paginate);
        getRecordsAndInit();
      }
    } else if (goTo === "previous") {
      //console.log("previous");
      if (paginate.offset > 0) {
        paginate.offset = paginate.offset - 1;
        // //console.log(paginate)
        setPaginate(paginate);
        getRecordsAndInit();
      }
    }
  };
  var UpdateOrderStatus = async () => {
    var _tempArray = [];
    var _obj = {
      OrderNumber: selectedOrder.OrderNumber,
      DeliveryCity: selectedOrder.ProductDetail[0].City,
      DriverPaymentAmount: 0,
      ProcessStatus: selectedOrder.PayToDriver,
    };
    var form = new FormData();
    _tempArray.push(_obj);

    form.append("DriverPaymentDetails", JSON.stringify(_tempArray));
    form.append("PaymentConfirmation", PaymentDocument);

    try {
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/admin/add-driverPayment`,
        form
      );
      if (response.data.status) {
        firetoast(
          "Record Updated Successfully!",
          "success",
          3000,
          "top-center"
        );
        toggle();
        getRecordsAndInit();
      } else {
        var { message, error } = response.data;
        firetoast(message || error, "default-error");
      }
    } catch (e) {
      firetoast("Something went wrong", "default-error");
      console.log(e);
    }
  };
  var getRoles = (record) => {
    var array = [];

    if (record.Admin === "Y") {
      array.push("Admin");
    }
    if (record.Customer === "Y") {
      array.push("Customer");
    }
    if (record.Vendor === "Y") {
      array.push("Vendor");
    }
    if (record.DeliveryPerson === "Y") {
      array.push("Delivery Person");
    }
    if (record.SuperAdmin === "Y") {
      array.push("Super Admin");
    }

    return array.toString();
  };
  var orderTotalAmount = (order) => {
    console.log(order);
    var currentOrder = order["ProductDetail"];
    var totalAmount = 0;
    for (let i = 0; i < currentOrder.length; i++) {
      totalAmount =
        totalAmount +
        parseFloat(currentOrder[i].BasePrice) +
        parseFloat(currentOrder[i].ItemsEstimatedTax) +
        parseFloat(currentOrder[i].ItemsShippingHandling);

      var combinations = currentOrder[i].ProductCombinations;
      var combinationPrices = 0;
      for (let j = 0; j < combinations.length; j++) {
        combinationPrices =
          combinationPrices +
          parseFloat(combinations[j]["ProductCombinationPrice"]);
      }
      totalAmount = totalAmount + combinationPrices;
    }

    return totalAmount;
  };
  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between">
        <h3 className="ftw-400">Driver Payments</h3>
      </div>
      <div className="card mt-2">
        <div className="card-body">
          <div className="d-flex justify-content-between mt-4">
            <div>
              <h6>
                Total Records :{" "}
                <span className="text-default">{totalRecords}</span>
              </h6>
              {/* <label style={{ fontSize: "15px" }}>
        Show Records{" "}
        <select onChange={(e) => showRecords(e.target.value)}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </label> */}
            </div>
            <div className="d-flex">
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
                  <DropdownItem
                    onClick={() => {
                      var filter = {
                        ...paginate,
                      };
                      filter.status = "Y";
                      setPaginate(filter);
                    }}
                  >
                    Paid
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      var filter = {
                        ...paginate,
                      };
                      filter.status = "N";
                      setPaginate(filter);
                    }}
                  >
                    Unpaid
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <UncontrolledDropdown style={{ marginRight: "5px" }}>
                <DropdownToggle className="text-dark" outline>
                  {paginate.limit}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => {
                      var filter = {
                        ...paginate,
                      };
                      filter.limit = "5";

                      setPaginate(filter);
                    }}
                  >
                    5
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      var filter = {
                        ...paginate,
                      };
                      filter.limit = "10";

                      setPaginate(filter);
                    }}
                  >
                    10
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      var filter = {
                        ...paginate,
                      };
                      filter.limit = "25";

                      setPaginate(filter);
                    }}
                  >
                    25
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>

              <CsvDownload
                data={records}
                filename="driver_to_pay.csv"
                className="btn btn-default-outline"
              >
                Export <i className="fas fa-arrow-alt-to-bottom"></i>
              </CsvDownload>
            </div>
          </div>
          <div>
            <div className="row mt-3 justify-content-between">
              <div className="col-4">
                <div className="form-group row">
                  {/* <label for="staticEmail" className="col-sm-4 col-form-label">
                By Name :
              </label> */}
                </div>
              </div>
              <div className="col-4 ">
                <Link
                  to="/panel/search/pay-to-driver"
                  className="btn btn-default float-right"
                >
                  Search Drivers
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-3 table-responsive">
            {isLoading ? (
              <div>
                <Loading />
              </div>
            ) : records.length > 0 ? (
              <table className="table table-borderless" id="myTable">
                <thead>
                  <tr>
                    <th>Order Number</th>
                    <th>Order Date</th>
                    <th>Delivery Date</th>
                    <th>Driver Name</th>
                    <th>Driver Email</th>
                    <th>Driver Contact</th>
                    <th>Total Products</th>
                    {paginate.PayToDriver === "Y" && <th>Payment Date</th>}
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {records.length > 0 &&
                    records.map((record, index) => (
                      <tr key={index}>
                        <td className="pt-18">{record.OrderNumber}</td>
                        <td className="pt-18">
                          {moment(record.OrderDate).format("YYYY-MM-DD")}
                        </td>
                        <td className="pt-18">
                          {" "}
                          {moment(record.DeliveryDate).format("YYYY-MM-DD")}
                        </td>
                        <td className="pt-18">
                          {record.ProductDetail[0].DriverName}
                        </td>
                        <td className="pt-18">
                          {record.ProductDetail[0].BusinessEmail}
                        </td>
                        <td className="pt-18">
                          {" "}
                          {record.ProductDetail[0].BusinessPhone}
                        </td>
                        <td className="pt-18">{record.ProductDetail.length}</td>

                        <td className="pt-18">
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
                        </td>
                        {paginate.status === "N" ? (
                          <td>
                            <button
                              className="btn btn-default w-100"
                              onClick={() => setSelectedRecord(record)}
                            >
                              Mark Paid
                            </button>
                          </td>
                        ) : null}
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center no-store-container ">
                <div className="mt-3">
                  <img src={NoStore} className="img-fluid no-store-img " />
                  <h2 className="ftw-400 mt-3">No Store Data Found </h2>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <Modal
          isOpen={modal}
          toggle={toggle}
          size="lg"
          centered
          backdrop={"static"}
        >
          <ModalHeader toggle={toggle}>Order Details</ModalHeader>
          <ModalBody>
            <div className="mt-2">
              <h6 className=" mb-4">
                Amount to be paid to driver is{" "}
                <span className="text-default">
                  BDT {selectedOrder && selectedOrder.DriverPaymentAmount}
                </span>
              </h6>
              <div className="table-responsive">
                <table className="table table-hover ">
                  <thead>
                    <th> Order Number</th>
                    <th> Title </th>
                    <th> Order Date</th>
                    <th> Delivery Date</th>
                    <th> City </th>
                    {/* <th> Total Amount </th> */}
                  </thead>
                  <tbody>
                    {selectedOrder &&
                      selectedOrder.ProductDetail.map((order, index) => (
                        <tr>
                          <td>{order.OrderNumber}</td>
                          <td>{order.Title}</td>
                          <td>
                            {moment(order.OrderDate).format("DD-MM-YYYY")}
                          </td>
                          <td>
                            {moment(order.OrderDate).format("DD-MM-YYYY")}
                          </td>
                          <td>{order.City}</td>
                          {/* <td>{orderTotalAmount(selectedOrder)}</td> */}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
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
};
