import { WebsiteHeader } from "./Layout/Header";
import { NewsLetter } from "./Layout/NewsLetter";
import { Footer } from "./Layout/Footer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BanglaBazarApi from "./../../Api/BanglaBazarApi";
import Endpoint from "./../../../Utils/Endpoint";
import FreeReturnProducts from "./Order Detail Component/FreeReturnProducts"
import PaidReturnProducts from "./Order Detail Component/PaidReturnProducts"
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";
import NoOrder from "../../../assets/images/no-request.svg";

function RefundForm() {
  const { orderNumber } = useParams();
  const [Orders, setOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState(null);
  const [ActiveTab, setActiveTab] = useState("1");
  const [DeliveredOrders, setDeliveredOrders] = useState([]);
  const [paginate, setPaginate] = useState({
    limit: "5",
    offset: 0,
    search: "",
    sort: "DESC",
  });
  useEffect(() => {
    getDetails();
  }, []);
  useEffect(() => {
    // if (orderDetail) {
    //   calculateSubtotal();
    //   //setDays(orderDetail[0][DeliveryDate])
    // }
    // let tempArray = [];
    // if (Orders && Orders.length) {
    //   console.log(Orders, "Orders")
    //   let _days = getDateDifference(Orders[0]["DeliveryDate"])
    //   setDays(parseInt(Math.abs(_days)));
    //   var found = false;
    //   for (let i = 0; i < Orders.length; i++) {
    //     console.log(Orders[i]["checked"])
    //     if (Orders[i]["checked"]) {
    //       console.log("in inside")
    //       tempArray.push(Orders[i]?.ProductID)
    //     }
    //   }
    //   console.log(tempArray, "tempArray")
    //   // setProductArray(document.write(tempArray.toString()))
    // }
  }, [Orders, orderDetail]);

  var getDetails = async () => {
    try {
      const response = await BanglaBazarApi.get(
        `${Endpoint}/api/admin/orderDetails/${orderNumber}`
      );
      console.log(response);
      setOrders(response.data.orderDetails["ProductDetail"]);
      setOrderDetail(response.data.orderDetails);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <WebsiteHeader />
      <div className="container">
        <>
        </>
        <div className="mt-4">
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
                      Free Return Products
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
                      Paid Return Products
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>

            </div>
            {Orders.length > 0 ? (
              <TabContent activeTab={ActiveTab}>
                <TabPane tabId="1" className="mt-1">
                  <FreeReturnProducts />
                </TabPane>
                <TabPane tabId="2">
                  <PaidReturnProducts />
                </TabPane>
              </TabContent>
            ) : (
              <div className="row">
                <div className="col-6 text-center m-auto">
                  <img src={NoOrder} className="img-fluid h-25 w-25" />
                  <h4 className="text-default mt-4">No orders to display</h4>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
      <NewsLetter />
      <Footer />
    </>
  );
}
export default RefundForm;
