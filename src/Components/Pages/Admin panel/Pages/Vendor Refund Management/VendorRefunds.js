import { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import classnames from "classnames";
import Loading from "./../../../../../Utils/Loading";
import BanglaBazarApi from "./../../../../Api/BanglaBazarApi";
import Endpoint from "./../../../../../Utils/Endpoint";
import firetoast from "./../../../../../Helpers/FireToast";
import ConfirmedPaidRefunds from "../Confirmed Refunds/ConfirmedPaidRefunds";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import VendorConfirmedFreeRefunds from "./VendorConfirmedFreeRefunds";
import VendorConfirmedPaidRefunds from "./VendorConfirmedPaidRefunds";


export function VendorRefunds() {
  const history = useHistory();
  const [sort, setSort] = useState("DESC");
  const [ActiveTab, setActiveTab] = useState("1");
  const { type } = useParams();
  const [paginate, setPaginate] = useState({
    offset: 0,
    limit: 5,
    search: "",
    sort: "DESC",
  });
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [refunds, setRefunds] = useState([]);

  useEffect(() => {
  }, []);
  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between">
        <h3 className="ftw-400">Refunds</h3>
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
              <VendorConfirmedFreeRefunds />
            </TabPane>
            <TabPane tabId="2">
              <VendorConfirmedPaidRefunds />
            </TabPane>
          </TabContent>
        }
      </div>
    </div>
  );
}
