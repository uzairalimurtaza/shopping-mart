import { useState } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";
import AdminAssignedOrders from "./Admin Order Types/AdminOrderAssigned";
import OrderReadyForUser from "./OrderReadyForUser";
import UserPickUpOrders from "./User Pickup Types/UserPickUpOrders";

function AllPickUpOrders() {
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
                    Ready
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
                    Delivered
                  </NavLink>
                </NavItem>
              </Nav>
            </div>
            <div></div>
          </div>

          <TabContent activeTab={ActiveTab}>
            <TabPane tabId="1" className="mt-1">
              <OrderReadyForUser />
            </TabPane>
            {parseInt(ActiveTab) > 1 && (
              <TabPane tabId={ActiveTab}>
                <UserPickUpOrders ActiveTab={ActiveTab} />
              </TabPane>
            )}
          </TabContent>
        </div>
      </div>
    </div>
  );
}
export default AllPickUpOrders;
