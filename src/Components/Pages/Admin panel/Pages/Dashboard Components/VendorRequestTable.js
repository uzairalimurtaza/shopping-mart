import { useContext } from "react";
import { PANEL_DASHBOARD_CONTEXT } from "./../../../../Contexts/PanelDashboardContext";
import firetoast from "./../../../../../Helpers/FireToast";
import Endpoint from "./../../../../../Utils/Endpoint";
import { Link } from "react-router-dom";
import noRequest from "../../../../../assets/images/no-request.svg";
import BanglaBazarApi from './../../../../Api/BanglaBazarApi';
function VendorRequestTable() {
  var { adminRequests, userSuperAdmin, getVendors, getVendors2 } = useContext(
    PANEL_DASHBOARD_CONTEXT
  );
  var setSuperAdminApproval = async (id) => {
    try {
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/admin/update-vendorSuperAdminStatus/${id}`
      );
      if (response.data.status) {
        getVendors2();
        firetoast("Vendor Store Approved", "success", 3000, "top-right");
      } else {
        firetoast(
          response.data.error || response.data.message,
          "error",
          3000,
          "top-right"
        );
      }
    } catch (e) {
      console.log(e);
      firetoast(
        "Error while updating vendor store",
        "error",
        3000,
        "top-right"
      );
    }
  };
  var setAdminApproval = async (id) => {
    try {
      var response = await BanglaBazarApi.put(
        `${Endpoint}/api/admin/update-vendorAdminStatus/${id}`
      );
      if (response.data.status) {
        firetoast("Vendor Store Approved", "success", 3000, "top-right");
        getVendors();
      } else {
        firetoast(
          response.data.error || response.data.message,
          "error",
          3000,
          "top-right"
        );
      }
    } catch (e) {
      console.log(e);
      firetoast(
        "Error while updating vendor store",
        "error",
        3000,
        "top-right"
      );
    }
  };
  return (
    <div className="card">
      <div
        className="card-header bg-white"
        style={{ borderBottom: "1px solid white" }}
      >
        <h5 className="ftw-400 text-default mt-2 mb-2">Vendor Requests</h5>
      </div>
      <div className="card-body">
        {adminRequests.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-borderless">
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Business Email</th>
                  <th>Business Phone</th>
                  <th>City</th>
                  <th>State</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {adminRequests.slice(0, 5).map((item, index) => (
                  <tr key={index}>
                    <td>{item.CompanyName}</td>
                    <td>{item.BusinessEmail}</td>
                    <td>{item.BusinessPhone}</td>
                    <td>{item.City}</td>
                    <td>{item.State}</td>
                    <td>
                      <Link
                        className="td-none text-default"
                        to={`/panel/viewBusiness/${item.VendorID}`}
                      >
                        View Details
                      </Link>
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
export default VendorRequestTable;
