import { useState } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";
import OrderReadyForAdmin from "./OrderReadyForAdmin";
import AdminAssignedOrders from "./Admin Order Types/AdminOrderAssigned";

function AllAdminOrders() {
  const [ActiveTab, setActiveTab] = useState("1");

  return (
    <div className="card mt-2">
      <div className="card-body">
        <div>
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
                    All
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
                    Assigned
                  </NavLink>
                </NavItem>
                <NavItem className="order-detail-tab">
                  <NavLink
                    className={classnames({
                      active: ActiveTab === "3",
                    })}
                    onClick={() => {
                      setActiveTab("3");
                    }}
                  >
                    Picked
                  </NavLink>
                </NavItem>
                <NavItem className="order-detail-tab">
                  <NavLink
                    className={classnames({
                      active: ActiveTab === "4",
                    })}
                    onClick={() => {
                      setActiveTab("4");
                    }}
                  >
                    On the way
                  </NavLink>
                </NavItem>
                <NavItem className="order-detail-tab">
                  <NavLink
                    className={classnames({
                      active: ActiveTab === "5",
                    })}
                    onClick={() => {
                      setActiveTab("5");
                    }}
                  >
                    Delivered
                  </NavLink>
                </NavItem>
                <NavItem className="order-detail-tab">
                  <NavLink
                    className={classnames({
                      active: ActiveTab === "6",
                    })}
                    onClick={() => {
                      setActiveTab("6");
                    }}
                  >
                    Cancelled
                  </NavLink>
                </NavItem>
                <NavItem className="order-detail-tab">
                  <NavLink
                    className={classnames({
                      active: ActiveTab === "7",
                    })}
                    onClick={() => {
                      setActiveTab("7");
                    }}
                  >
                    Returned
                  </NavLink>
                </NavItem>
              </Nav>
            </div>
            <div></div>
          </div>

          <TabContent activeTab={ActiveTab}>
            <TabPane tabId="1" className="mt-1">
              <OrderReadyForAdmin />
            </TabPane>
            {parseInt(ActiveTab) > 1 && (
              <TabPane tabId={ActiveTab}>
                <AdminAssignedOrders ActiveTab={ActiveTab} />
              </TabPane>
            )}
          </TabContent>
        </div>
      </div>
    </div>
  );
}
export default AllAdminOrders;
