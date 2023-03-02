import Loading from "./../../../../../Utils/Loading";
import { useState, useEffect } from "react";
import NoStore from "../../../../../assets/images/no-store.svg";
import { useParams, Link, useHistory } from "react-router-dom";
import { CurrentUser } from "./../../../../../Helpers/Auth";
import firetoast from "./../../../../../Helpers/FireToast";
import Endpoint from "./../../../../../Utils/Endpoint";
import CsvDownload from "react-json-to-csv";
import ConfirmedRequestDetails from "./ConfirmedRefundDetails";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";
import ConfirmedFreeRefunds from "./ConfirmedFreeRefunds"
import ConfirmedPaidRefunds from "./ConfirmedPaidRefunds"
function ConfirmedRefunds() {
  const history = useHistory();
  const [paginate, setPaginate] = useState({
    offset: 0,
    limit: "5",
    search: "",
    sort: "DESC",
    status: "Processing",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ActiveTab, setActiveTab] = useState("1");

  const { type } = useParams();

  useEffect(() => {
  }, []);



  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between">
        <h3 className="ftw-400">Payment Process Requests</h3>
      </div>
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
          <TabContent activeTab={ActiveTab}>
            <TabPane tabId="1" className="mt-1">
              <ConfirmedFreeRefunds />
            </TabPane>
            <TabPane tabId="2">
              <ConfirmedPaidRefunds />
            </TabPane>
          </TabContent>
        }
      </div>

      <ConfirmedRequestDetails
        isOpen={showDetails}
        setIsOpen={setShowDetails}
        orderNumber={selectedOrder}
        type={type}
      />
    </div>
  );
}
export default ConfirmedRefunds;
