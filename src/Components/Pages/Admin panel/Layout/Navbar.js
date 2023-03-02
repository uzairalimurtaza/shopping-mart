import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import axios from "axios";
import Endpoint from "./../../../../Utils/Endpoint";
import { CurrentUser } from "./../../../../Helpers/Auth";
import BanglaBazarApi from "./../../../Api/BanglaBazarApi";

import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Dropdown,
} from "reactstrap";
function AdminNavbar(props) {
  let history = useHistory();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const [ProfilePic, setProfilePic] = useState(null);
  var logout = async () => {
    await BanglaBazarApi.post(`${Endpoint}/api/user/logout`, {
      SessionID: localStorage.getItem("accessToken"),
    });
    toast.success("Logging out...", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    localStorage.clear();
    setTimeout(() => {
      window.location.href = `/`;
    }, 3000);
  };
  useEffect(() => {
    getUserInfo();
    if (CurrentUser) getUserNotification();
  }, []);
  var getUserInfo = async () => {
    var { UserID } = JSON.parse(localStorage.getItem("user"));
    try {
      var response = await BanglaBazarApi.get(`${Endpoint}/api/admin/get/${UserID}`);
      let data = response.data.profile;

      setProfilePic(data.ProfilePic);
    } catch (e) {
      console.log(e);
    }
  };
  var getUserNotification = async () => {
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/admin/notifications`
      );
      setNotifications(response.data.notifications);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <nav>
      <div className="container-fluid">
        {/* className="collapse navbar-collapse" id="navbarSupportedContent" */}
        <div className="row">
          <div className="col-lg-1 col-xl-1 col-md-1 col-sm-6 col-xs-6 mt-1">
            <button
              type="button"
              id="sidebarCollapse"
              className="btn btn-default-toggle btn-block"
              onClick={() => props.toggleSidebar(!props.toggle)}
            >
              <i className="fas fa-align-left"></i>
            </button>
          </div>
          <div className="col-lg-7 col-xl-7 col-md-7 col-sm- mt-1 d-md-block d-none d-sm-none d-lg-block">
            <div className="search-input">
              <input
                className="form-control search"
                type="search"
                placeholder="Search..."
              />
            </div>
          </div>
          {/* <div className="col-3 d-none d-lg-block d-xl-none d-md-none d-sm-none"></div> */}
          <div
            className="col-lg-4 col-xl-4 col-md-4 col-sm-6 col-xs-6  "
            style={{ float: "right" }}
          >
            <div
              className="d-flex "
              style={{ float: "right", alignItems: "center" }}
            >
              <span
                className="fa-stack has-badge"
                data-count={notifications.length}
              >
                <Dropdown
                  isOpen={dropdownOpen}
                  toggle={toggle}
                  direction="left"
                >
                  <DropdownToggle style={{ backgroundColor: "transparent" }}>
                    <i
                      className="fa fa-bell text-secondary"
                      style={{ fontSize: "20px" }}
                    ></i>
                  </DropdownToggle>
                  <DropdownMenu className="notification-menu">
                    {notifications.length > 0 ? (
                      notifications.map((item, index) => (
                        <DropdownItem key={index}>
                          <div
                            data-letters="AD"
                            onClick={() =>
                              history.push("/panel/userManagement")
                            }
                          >
                            {" "}
                            {/* {item.Body} */}
                            {item.TypeID === 6 && (
                              <span
                                onClick={() => history.push("/order-details")}
                              >
                                {JSON.parse(item.Body).Body} with order number{" "}
                                <span className="text-default">
                                  {JSON.parse(item.Body).OrderNumber}
                                </span>
                              </span>
                            )}
                          </div>
                        </DropdownItem>
                      ))
                    ) : (
                      <DropdownItem>
                        <div> No Data Found</div>
                      </DropdownItem>
                    )}
                  </DropdownMenu>
                </Dropdown>
              </span>
              <div style={{ marginLeft: "25px" }}>
                <img
                  className="img-fluid avatar"
                  alt="profile"
                  src={
                    !ProfilePic || ProfilePic.length < 1
                      ? "http://cdn.onlinewebfonts.com/svg/img_383212.png"
                      : `${Endpoint}/${ProfilePic}`
                  }
                />
              </div>
              <div style={{ marginLeft: "25px" }}>
                <UncontrolledButtonDropdown direction="left">
                  <DropdownToggle className=" btn-light">
                    <i className="fas fa-chevron-down text-dark"></i>
                  </DropdownToggle>
                  <DropdownMenu className="admin-nav-toggle">
                    {/* <DropdownItem>View</DropdownItem> */}

                    <DropdownItem onClick={() => history.push("/")}>
                      Home
                    </DropdownItem>
                    <DropdownItem onClick={() => history.push("/my-chats")}>
                      Chats
                    </DropdownItem>
                    <DropdownItem onClick={() => logout()}>Logout</DropdownItem>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default AdminNavbar;
