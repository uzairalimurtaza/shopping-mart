import { useContext } from "react";
import { PANEL_DASHBOARD_CONTEXT } from "./../../../../Contexts/PanelDashboardContext";
import firetoast from "./../../../../../Helpers/FireToast";

import Endpoint from "./../../../../../Utils/Endpoint";
import { Link } from "react-router-dom";
import noRequest from "../../../../../assets/images/no-request.svg";
import { getRoles } from "./../../../../../Helpers/Auth";
import BanglaBazarApi from './../../../../Api/BanglaBazarApi';
function ProductRequestTable() {
  var {
    productsRequests,
    userSuperAdmin,
    getAdminReviewProducts,
    getSuperAdminReviewProducts,
  } = useContext(PANEL_DASHBOARD_CONTEXT);
  var setSuperAdminApproval = async (id) => {
    try {
      var response = await BanglaBazarApi.put(
        `${Endpoint}/api/admin/update-productByActiveStatus/${id}`
      );
      if (response.data.status) {
        getSuperAdminReviewProducts();
        firetoast("Product Approved", "success", 3000, "top-right");
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
        `${Endpoint}/api/admin/update-productStatus/${id}`
      );
      if (response.data.status) {
        firetoast("Product Approved", "success", 3000, "top-right");
        getAdminReviewProducts();
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
        <h5 className="ftw-400 text-default mt-2 mb-2">Product Requests</h5>
      </div>
      <div className="card-body">
        {productsRequests.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-borderless">
              <thead>
                <tr>
                  <th>Store Name</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {productsRequests.map((item, index) => (
                  <tr key={index}>
                    <td>{item.StoreName}</td>
                    <td>{item.Title}</td>
                    <td>{item.Price}</td>

                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => {
                          if (getRoles().includes("Super Admin")) {
                            setSuperAdminApproval(item.ProductID);
                          } else {
                            setAdminApproval(item.ProductID);
                          }
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
export default ProductRequestTable;
