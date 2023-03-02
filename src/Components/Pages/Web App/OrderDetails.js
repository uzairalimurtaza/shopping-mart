import { WebsiteHeader } from "./Layout/Header";
import { NewsLetter } from "./Layout/NewsLetter";
import { Footer } from "./Layout/Footer";
import { BreadcrumbItem, Breadcrumb } from "reactstrap";
import classnames from "classnames";
import { useState, useEffect } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import AllOrderTab from "./Order Detail Component/AllOrdersTab";
import DeliveredOrderTab from "./Order Detail Component/DeliveredOrderTab";
import CancelledOrderTab from "./Order Detail Component/CancelledOrderTab";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./../../../Utils/Loading";
import firetoast from "./../../../Helpers/FireToast";
import { GetUserOrderDetails } from "./../../../Actions/OrderDetailsAction";
import NoOrder from "../../../assets/images/no-request.svg";
import { CurrentUser } from "./../../../Helpers/Auth";
import { RefundRequests } from "./Order Detail Component/RefundRequests";
function OrderDetails() {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const { userOrderDetails } = state;
  const [ActiveTab, setActiveTab] = useState("1");
  const [Orders, setOrders] = useState([]);
  const [CancelledOrders, setCancelledOrders] = useState([]);
  const [DeliveredOrders, setDeliveredOrders] = useState([]);
  const [paginate, setPaginate] = useState({
    limit: "5",
    offset: 0,
    search: "",
    sort: "DESC",
  });
  const [totalRecords, setTotalRecords] = useState(0);
  useEffect(() => {
    if (CurrentUser) {
      dispatch(GetUserOrderDetails(paginate));
      if (!userOrderDetails.loading) {
        if (userOrderDetails.error) {
          firetoast("Something went wrong!", "default-error");
        } else {
          setOrders(userOrderDetails.data.orderDetails);
          let tempOrders = userOrderDetails.data.orderDetails;
          let array = [];
          let array2 = [];
          for (let i = 0; i < tempOrders.length; i++) {
            if (
              tempOrders[i].PaymentStatus === "cancel" ||
              tempOrders[i].ProcessStatus === "Cancelled"
            ) {
              array.push(tempOrders[i]);
            }
            if (tempOrders[i].ProcessStatus === "Delivered") {
              array2.push(tempOrders[i]);
            }
          }

          setCancelledOrders(array);
          setDeliveredOrders(array2);
          setTotalRecords(userOrderDetails.data.total_records);
        }
      }
    }
  }, [userOrderDetails.loading]);
  useEffect(() => {
    let tempOrders = userOrderDetails.data.orderDetails;
    if (tempOrders) {
      setOrders(tempOrders);
      let array = [];
      let array2 = [];
      for (let i = 0; i < tempOrders.length; i++) {
        if (
          tempOrders[i].PaymentStatus === "cancel" ||
          tempOrders[i].ProcessStatus === "Cancelled"
        ) {
          array.push(tempOrders[i]);
        }
        if (tempOrders[i].ProcessStatus === "Delivered") {
          array2.push(tempOrders[i]);
        }
      }

      setCancelledOrders(array);
      setDeliveredOrders(array2);
      setTotalRecords(userOrderDetails.data.total_records);
    }
  }, [dispatch, userOrderDetails]);

  var paginateData = (goTo) => {
    //console.log("called");
    var offset = paginate.offset + 1;
    var numOfPages = Math.ceil(totalRecords / offset);
    if (goTo === "next") {
      if (offset < numOfPages) {
        console.log(offset, numOfPages);
        paginate.offset = paginate.offset + 1;
        // //console.log(paginate)
        dispatch(GetUserOrderDetails(paginate));
      }
    } else if (goTo === "previous") {
      //console.log("previous");
      if (paginate.offset > 0) {
        paginate.offset = paginate.offset - 1;
        // //console.log(paginate)
        dispatch(GetUserOrderDetails(paginate));
      }
    }
  };
  return (
    <>
      <WebsiteHeader />

      <div className="container">
        <>
          <div className="pt-2 pb-0">
            <Breadcrumb listTag="div">
              <BreadcrumbItem
                href="/"
                tag="a"
                className="td-none"
                style={{ color: "#B1B1B1" }}
              >
                Home
              </BreadcrumbItem>
              <BreadcrumbItem
                href="/order-details"
                tag="a"
                className="td-none"
                style={{ color: "#787878" }}
              >
                Order
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        </>
        {CurrentUser && userOrderDetails.loading ? (
          <Loading text="Getting Data" />
        ) : (
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
                        Delivered
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
                        Cancelled
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
                        Refunds
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>
                {ActiveTab !== "1" ? null : (
                  <>
                    <div>
                      <div
                        class="input-group mb-3"
                        style={{ marginLeft: "5px" }}
                      >
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Search Order Number"
                          aria-describedby="order-number"
                          onChange={(e) => {
                            var temp = { ...paginate };
                            temp["search"] = e.target.value;
                            setPaginate(temp);
                          }}
                        />
                        <div class="input-group-append">
                          <button
                            class="bt-default-nav-search"
                            onClick={() => {
                              dispatch(GetUserOrderDetails(paginate));
                            }}
                          >
                            <i class="fas fa-search"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div>
                        <div
                          className="btn-group btn-left-padding"
                          role="group"
                          aria-label="Basic example"
                        >
                          <button
                            className="btn btn-light btn-sm text-default"
                            type="button"
                            onClick={() => paginateData("previous")}
                          >
                            <i className="fa fa-arrow-left"></i>
                          </button>
                          <button
                            className="btn btn-light btn-sm"
                            type="button"
                          >
                            {paginate.offset + 1}
                          </button>
                          <button
                            className="btn btn-light btn-sm text-default"
                            type="button"
                            data-bs-original-title=""
                            title=""
                            onClick={() => paginateData("next")}
                          >
                            <i className="fa fa-arrow-right"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {Orders.length > 0 ? (
                <TabContent activeTab={ActiveTab}>
                  <TabPane tabId="1" className="mt-1">
                    <AllOrderTab Orders={Orders} />
                  </TabPane>
                  <TabPane tabId="2">
                    <DeliveredOrderTab Orders={DeliveredOrders} />
                  </TabPane>
                  <TabPane tabId="3" className="mt-1">
                    <CancelledOrderTab Orders={CancelledOrders} />
                  </TabPane>
                  <TabPane tabId="4" className="mt-1">
                    <RefundRequests />
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
        )}
      </div>
      <NewsLetter />
      <Footer />
    </>
  );
}
export default OrderDetails;
