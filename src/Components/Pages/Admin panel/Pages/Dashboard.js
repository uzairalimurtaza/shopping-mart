import { useEffect, useState, useContext } from "react";
import firetoast from "./../../../../Helpers/FireToast";
import Endpoint from "./../../../../Utils/Endpoint";
import { CurrentUser, getRoles } from "./../../../../Helpers/Auth";
import { PANEL_DASHBOARD_CONTEXT } from "./../../../Contexts/PanelDashboardContext";
import accessdenied from "../../../../assets/images/accessdenied.png";
import VendorRequestTable from "./Dashboard Components/VendorRequestTable";
import { useHistory } from "react-router-dom";
import ProductRequestTable from "./Dashboard Components/ProductRequestTable";
import DriverRequestTable from "./Dashboard Components/DriverRequestTable";
import RefundRequestTable from "./Dashboard Components/RefundRequestTable";
import UspsRequestTable from "./Dashboard Components/UspsRequestsTable";
import OrderRequestTable from "./Dashboard Components/OrderRequests";
import BanglaBazarApi from "./../../../Api/BanglaBazarApi";
import PaidRefundRequestTable from "./Dashboard Components/PaidRefundRequestTable";
function PanelDashboad() {
  const history = useHistory();
  useContext(PANEL_DASHBOARD_CONTEXT);
  const [adminRequests, setAdminRequests] = useState([]);
  const [productsRequests, setProductsRequests] = useState([]);

  const [userSuperAdmin, setUserSuperAdmin] = useState("");
  const [totalVendors, setVendorCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [DriverRequests, setDriverRequests] = useState([]);
  const [VendorDeliveryCount, setVendorDeliveryCount] = useState(null);
  useEffect(async () => {
    var user = CurrentUser;
    if (user.SuperAdmin && user.SuperAdmin === "Y") {
      setUserSuperAdmin(true);
      await getSuperAdminReviewProducts();
      await getVendors2();
    } else if (user.Admin && user.Admin === "Y") {
      setUserSuperAdmin(false);
      await getVendors();
      await getAdminReviewProducts();
    } else if (user.Admin !== "Y" && !user.SuperAdmin !== "Y") {
      setUserSuperAdmin("");
    }

    vendorCount();
    getUsers();
    getDriverRequests();
    VendorCounts();
  }, []);
  var getDriverRequests = async () => {
    try {
      const response = await BanglaBazarApi.get(
        `${Endpoint}/api/admin/pending-requests`
      );
      setDriverRequests(response.data.deliveryDriverDetails);
    } catch (e) {
      firetoast("Error while getting requests", "error", 3000, "top-right");
    }
  };
  var getVendors = async () => {
    try {
      const response = await BanglaBazarApi.get(
        `${Endpoint}/api/admin/get-businessRecords`
      );
      setAdminRequests(response.data.VendorBusinessRecords);
    } catch (e) {
      firetoast("Error while getting requests", "error", 3000, "top-right");
    }
  };
  var getVendors2 = async () => {
    try {
      const response = await BanglaBazarApi.get(
        `${Endpoint}/api/admin/get-vendorBusinessRecord`
      );
      setAdminRequests(response.data.VendorBusinessRecords);
    } catch (e) {
      firetoast("Error while getting requests", "error", 3000, "top-right");
    }
  };
  var vendorCount = async () => {
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/admin/get-vendorCount`
      );
      setVendorCount(response.data.VendorCount);
    } catch (e) {
      firetoast("Error while getting vendor count", "error", 3000, "top-right");
    }
  };
  var getUsers = async () => {
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/admin/get-profileCount`
      );
      setTotalUsers(response.data.UserCount);
    } catch (e) {
      firetoast("Error while getting users count", "error", 3000, "top-right");
    }
  };
  var VendorCounts = async () => {
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/store-management/vendor-dashboard`
      );
      console.log(response.data.VendorOrderStatusCount);
      setVendorDeliveryCount(response.data.VendorOrderStatusCount);
    } catch (e) {
      console.log(e);
    }
  };

  var getAdminReviewProducts = async () => {
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/admin/get-productByStatus`
      );
      setProductsRequests(response.data.Products);
    } catch (e) {
      firetoast(
        "Error while getting products request",
        "error",
        3000,
        "top-right"
      );
    }
  };
  var getSuperAdminReviewProducts = async () => {
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/admin/get-productBySuperAdminStatus`
      );
      setProductsRequests(response.data.Products);
    } catch (e) {
      firetoast(
        "Error while getting products request",
        "error",
        3000,
        "top-right"
      );
    }
  };
  return (
    <div className="mt-4">
      {!getRoles().includes("Admin") ? (
        <div>
          <h4 className="text-default">
            <i className="fal fa-tachometer-alt"></i> Dashboard
          </h4>
          <div className="row">
            <div className="col-md-3">
              <div
                className="card-counter"
                style={{ position: "relative", cursor: "pointer" }}
                onClick={() => history.push("/panel/userManagement")}
              >
                <span className="count-numbers">
                  {VendorDeliveryCount ? VendorDeliveryCount.AssignedOrders : 0}
                </span>
                <span className="count-name">Assigned Orders</span>
              </div>
            </div>
            <div className="col-md-3">
              <div
                className="card-counter"
                style={{ position: "relative", cursor: "pointer" }}
                onClick={() => history.push("/panel/vendor-management")}
              >
                <span className="count-numbers">
                  {" "}
                  {VendorDeliveryCount
                    ? VendorDeliveryCount.DeliveredOrders
                    : 0}
                </span>
                <span className="count-name">Delivered Orders</span>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card-counter" style={{ position: "relative" }}>
                <span className="count-numbers">
                  {VendorDeliveryCount ? VendorDeliveryCount.OntheWayOrders : 0}
                </span>
                <span className="count-name">On the Way Orders</span>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card-counter" style={{ position: "relative" }}>
                <span className="count-numbers">
                  {VendorDeliveryCount ? VendorDeliveryCount.PickedOrders : 0}
                </span>
                <span className="count-name">Picked Orders </span>
              </div>
            </div>
            <div className="col-md-3">
              <div
                className="card-counter"
                style={{ position: "relative", cursor: "pointer" }}
                onClick={() => history.push("/panel/vendor-management")}
              >
                <span className="count-numbers">
                  {VendorDeliveryCount ? VendorDeliveryCount.ReturnedOrders : 0}
                </span>
                <span className="count-name">Returned Orders</span>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card-counter" style={{ position: "relative" }}>
                <span className="count-numbers">
                  {VendorDeliveryCount ? VendorDeliveryCount.CancelledOrder : 0}
                </span>
                <span className="count-name">Cancelled Orders</span>
              </div>
            </div>
          </div>
          <div className="row m-0 mt-5">
            <div className="col-lg-8 col-md-8 col-sm-12 mb-2">
              <OrderRequestTable />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <PANEL_DASHBOARD_CONTEXT.Provider
            value={{
              adminRequests,
              userSuperAdmin,
              getVendors,
              getVendors2,
              productsRequests,
              setProductsRequests,
              getAdminReviewProducts,
              getSuperAdminReviewProducts,
              DriverRequests,
              getDriverRequests,
            }}
          >
            <div className="">
              <div className="row">
                <div className="col-md-3">
                  <div
                    className="card-counter"
                    style={{ position: "relative", cursor: "pointer" }}
                    onClick={() => history.push("/panel/userManagement")}
                  >
                    <i className="fa fa-users"></i>
                    <span className="count-numbers">{totalUsers}</span>
                    <span className="count-name">Users</span>
                  </div>
                </div>
                <div className="col-md-3">
                  <div
                    className="card-counter"
                    style={{ position: "relative", cursor: "pointer" }}
                    onClick={() => history.push("/panel/vendor-management")}
                  >
                    <i className="fas fa-store"></i>
                    <span className="count-numbers">{totalVendors}</span>
                    <span className="count-name">Vendors</span>
                  </div>
                </div>

                <div className="col-md-3">
                  <div
                    className="card-counter"
                    style={{ position: "relative" }}
                  >
                    <i className="fa fa-ticket"></i>
                    <span className="count-numbers">
                        {productsRequests.length}
                    </span>
                    <span className="count-name">Product Requests</span>
                  </div>
                </div>
                <div className="col-md-3">
                  <div
                    className="card-counter"
                    style={{ position: "relative" }}
                  >
                    <i className="fas fa-truck-pickup"></i>
                    <span className="count-numbers">
                      {DriverRequests.length}
                    </span>
                    <span className="count-name">Vendor Requests</span>
                  </div>
                </div>

                {/* <div className="col-md-3">
                  <div
                    className="card-counter success"
                    style={{ position: "relative" }}
                  >
                    <i className="fa fa-database"></i>
                    <span className="count-numbers">6875</span>
                    <span className="count-name">Data</span>
                  </div>
                </div> */}
              </div>
            </div>
            <div className="row m-0 mt-5">
              <div className="col-lg-6 col-md-6 col-sm-12 mb-2">
                <VendorRequestTable />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mb-2">
                <ProductRequestTable />
              </div>
              {getRoles().includes("Super") && (
                <div className="col-lg-6 col-md-6 col-sm-12 mb-2">
                  <RefundRequestTable />
                </div>
              )}
              {getRoles().includes("Super") && (
                <div className="col-lg-6 col-md-6 col-sm-12 mb-2">
                  <PaidRefundRequestTable />
                </div>
              )}
              <div className="col-lg-6 col-md-6 col-sm-12 mb-2">
                <DriverRequestTable />
              </div>
              {getRoles().includes("Super") && (
                <div className="col-lg-6 col-md-6 col-sm-12 mb-2">
                  <UspsRequestTable />
                </div>
              )}
              <div className="col-lg-6 col-md-6 col-sm-12 mb-2">
                <OrderRequestTable />
              </div>
            </div>
          </PANEL_DASHBOARD_CONTEXT.Provider>
        </div>
      )}
    </div>
  );
}
export default PanelDashboad;
