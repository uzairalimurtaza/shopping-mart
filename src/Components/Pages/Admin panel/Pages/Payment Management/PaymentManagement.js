import Loading from "./../../../../../Utils/Loading";
import { useState, useEffect } from "react";
import { Button } from "reactstrap";
import NoStore from "../../../../../assets/images/no-store.svg";
import { Link, useHistory } from "react-router-dom";
import { CurrentUser } from "./../../../../../Helpers/Auth";
import firetoast from "./../../../../../Helpers/FireToast";
import Endpoint from "./../../../../../Utils/Endpoint";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import FreeReturnOrders from "../../Pages/Payment Management/FreeReturnOrders"
import PaidReturnOrders from "../../Pages/Payment Management/PaidReturnOrders"

import classnames from "classnames";

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalFooter,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import BanglaBazarApi from "./../../../../Api/BanglaBazarApi";
import moment from "moment";
function PaymentManagement() {
  const history = useHistory();
  ;
  const [isLoading, setIsLoading] = useState(false);
  const [Payments, setPayments] = useState([]);
  const [ConfirmationModal, setConfirmationModal] = useState(false);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState(false);
  const [ActiveTab, setActiveTab] = useState("1");
  const [totalRecords, setTotalRecords] = useState(0);
  const [paginate, setPaginate] = useState({
    offset: "0",
    limit: "5",
    search: "",
    sort: "DESC",
    status: "Processing",
  })

  useEffect(() => {
  }, []);

  var generateRefund = async () => {
    try {
      const response = await BanglaBazarApi.get(
        `${Endpoint}/api/sslCommerz/initiate-refund/${selectedOrderNumber}`
      );
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
    }
  };
  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between">
        <h3 className="ftw-400">Refund Management</h3>
        <div>
          <Link to="/panel/vendor/refunds" className="btn btn-default">
            My Refund Requests
          </Link>
          <Link
            to="/panel/vendor/confirmed-refunds"
            className="btn btn-danger"
            style={{ marginLeft: "10px" }}
          >
            Confirmed Requests
          </Link>
        </div>
      </div>
      <div className="card mt-2">
        <div className="card-body">
          <>
            <div className="mt-3 table-responsive">
              <div className="d-flex justify-content-between">
                <div>
                  <Nav tabs className="w-100">
                    <NavItem className="order-detail-tab">
                      <NavLink
                        className={classnames({
                          active: ActiveTab === "1",
                        })}
                        onClick={() => {
                          setActiveTab("1");
                        }}
                      >
                        Free Return Orders
                      </NavLink>
                    </NavItem>
                    <NavItem className="order-detail-tab">
                      <NavLink
                        className={classnames({
                          active: ActiveTab === "2",
                        })}
                        onClick={() => {
                          setActiveTab("2");
                        }}
                      >
                        Paid Return Orders
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>

              </div>
              {isLoading ? (
                <div>
                  <Loading />
                </div>
              )
                :
                // <table className="table table-borderless" id="myTable">
                //   <thead>
                //     <tr>
                //       <th style={{ width: "15%" }}>Order Number</th>

                //       <th>Transaction Id</th>
                //       <th>Order Date</th>
                //       <th>Payment Status</th>
                //       <th>Product Count</th>
                //       <th></th>
                //     </tr>
                //   </thead>
                //   <tbody>
                //     {Payments.map((payment, index) => (
                //       <tr key={index}>
                //         <td className="pt-18">
                //           <Link
                //             className="td-none text-default"
                //             to={`/panel/admin/refund-details/${payment.OrderNumber}/Processing`}
                //           >
                //             {payment.OrderNumber}
                //           </Link>
                //         </td>
                //         <td className="pt-18">{payment.TransactionID}</td>
                //         <td className="pt-18">
                //           {moment(payment.OrderDate).format("DD-MM-YYYY")}
                //         </td>
                //         <td className="pt-18">{payment.PaymentStatus}</td>
                //         <td className="pt-18">
                //           {payment.ProductDetail.length}
                //         </td>

                //         {/* <td className="pt-18">
                //           {" "}
                //           <>
                //             <span
                //               className="badge text-default bg-light"
                //               style={{ fontSize: "13px", cursor: "pointer" }}
                //               onClick={() => {
                //                 setSelectedOrderNumber(payment.OrderNumber);
                //                 setConfirmationModal(!ConfirmationModal);
                //               }}
                //             >
                //               {" "}
                //               Init Refund
                //             </span>
                //           </>
                //         </td> */}
                //         <td className="pt-18">
                //           {" "}
                //           <>
                //             <span
                //               className="badge text-default bg-light"
                //               style={{ fontSize: "13px", cursor: "pointer" }}
                //               onClick={() => {
                //                 history.push(
                //                   `/panel/admin/refund-details/${payment.OrderNumber}/Processing`
                //                 );
                //               }}
                //             >
                //               Show Details
                //             </span>
                //           </>
                //         </td>
                //       </tr>
                //     ))}
                //   </tbody>
                // </table>
                <TabContent activeTab={ActiveTab}>
                  <TabPane tabId="1" className="mt-1">
                    <FreeReturnOrders />
                  </TabPane>
                  <TabPane tabId="2">
                    <PaidReturnOrders />
                  </TabPane>
                </TabContent>
              }
            </div>
          </>
        </div>
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
        </ModalBody>
        <ModalFooter style={{ padding: "5px" }}>
          <Button color="default" onClick={() => generateRefund()}>
            Generate
          </Button>{" "}
          <Button onClick={() => setConfirmationModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div >
  );
  // return (
  //   <>
  //     <div className="container">
  //       <>
  //       </>
  //       <div className="mt-4">
  //         <div>
  //           <div className="d-flex justify-content-between">
  //             <div>
  //               <Nav tabs className="w-100">
  //                 <NavItem className="order-detail-tab">
  //                   <NavLink
  //                     className={classnames({
  //                       active: ActiveTab === "1",
  //                     })}
  //                     onClick={() => {
  //                       setActiveTab("1");
  //                     }}
  //                   >
  //                     Free Return Orders
  //                   </NavLink>
  //                 </NavItem>
  //                 <NavItem className="order-detail-tab">
  //                   <NavLink
  //                     className={classnames({
  //                       active: ActiveTab === "2",
  //                     })}
  //                     onClick={() => {
  //                       setActiveTab("2");
  //                     }}
  //                   >
  //                     Paid Return Orders
  //                   </NavLink>
  //                 </NavItem>
  //               </Nav>
  //             </div>

  //           </div>
  //           {Orders.length > 0 ? (
  //             <TabContent activeTab={ActiveTab}>
  //               <TabPane tabId="1" className="mt-1">
  //                 <FreeReturnOrders />
  //               </TabPane>
  //               <TabPane tabId="2">
  //                 <PaidReturnOrders />
  //               </TabPane>
  //             </TabContent>
  //           ) : (
  //             <div className="row">
  //               <div className="col-6 text-center m-auto">
  //                 <img src={NoOrder} className="img-fluid h-25 w-25" />
  //                 <h4 className="text-default mt-4">No orders to display</h4>
  //               </div>
  //             </div>
  //           )}
  //         </div>
  //       </div>

  //     </div>
  //     <NewsLetter />
  //     <Footer />
  //   </>
  // );

}
export default PaymentManagement;
