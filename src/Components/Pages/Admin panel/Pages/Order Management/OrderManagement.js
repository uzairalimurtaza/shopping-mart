import { useState, useEffect } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import NonProcessedOrders from "./NonProcessedOrders";
import classnames from "classnames";
import OrderReadyForAdmin from "./OrderReadyForAdmin";
import OrderReadyForUser from "./OrderReadyForUser";
import AllAdminOrders from "./AllAdminOrders";
import AllPickUpOrders from "./AllPickUpOrders";

function OrderManagement() {
  const [ActiveTab, setActiveTab] = useState("1");
  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between">
        <h3 className="ftw-400">Order Management</h3>
      </div>
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
                  Ready to deliver
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
                  Ready for pickup
                </NavLink>
              </NavItem>
            </Nav>
          </div>
          <div></div>
        </div>

        <TabContent activeTab={ActiveTab}>
          <TabPane tabId="1" className="mt-1">
            <NonProcessedOrders />
          </TabPane>
          <TabPane tabId="2">
            <AllAdminOrders />
          </TabPane>
          <TabPane tabId="3" className="mt-1">
            {/* <OrderReadyForUser /> */}
            <AllPickUpOrders />
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
}
export default OrderManagement;
