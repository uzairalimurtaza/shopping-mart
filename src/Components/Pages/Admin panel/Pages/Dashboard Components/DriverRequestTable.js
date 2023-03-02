import { useContext } from "react";
import { PANEL_DASHBOARD_CONTEXT } from "./../../../../Contexts/PanelDashboardContext";
import firetoast from "./../../../../../Helpers/FireToast";
import Endpoint from "./../../../../../Utils/Endpoint";
import { Link } from "react-router-dom";
import noRequest from "../../../../../assets/images/no-request.svg";
import BanglaBazarApi from './../../../../Api/BanglaBazarApi';
function DriverRequestTable() {
  var { DriverRequests, getDriverRequests } = useContext(
    PANEL_DASHBOARD_CONTEXT
  );
  var setSuperAdminApproval = async (id) => {
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/admin/update-driverStatus/${id}`
      );
      if (response.data.status) {
        getDriverRequests();
        firetoast("Driver Approved", "success", 3000, "top-right");
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
        "Error while updating driver status",
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
        <h5 className="ftw-400 text-default mt-2 mb-2">Driver Requests</h5>
      </div>
      <div className="card-body">
        {DriverRequests.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-borderless">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>City</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Govt. Id</th>
                </tr>
              </thead>
              <tbody>
                {DriverRequests.slice(0, 5).map((item, index) => (
                  <tr key={index}>
                    <td>{item.UserName}</td>
                    <td>{item.City}</td>
                    <td>{item.EmailAddress}</td>
                    <td>{item.PhoneNumber || item.BusinessPhone}</td>
                    <td>{item.GovernmentID}</td>
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => {
                          setSuperAdminApproval(item.UserID);
                        }}
                      >
                        Approve
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
export default DriverRequestTable;
