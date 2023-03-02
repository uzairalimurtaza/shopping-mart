import { Container, List, ListInlineItem } from "reactstrap";
import Signin from "../Modals/Signin";
import { useState, useEffect, useContext } from "react";
import Signup from "../Modals/Signup";
import OtpVerify from "../Modals/OtpVerify";
import { CurrentUser } from "./../../../../Helpers/Auth";
import axios from "axios";
import Endpoint from "./../../../../Utils/Endpoint";
import MODAL_CONTEXT from "../../../Contexts/ModalContext";
import { useHistory, useLocation, useParams } from "react-router";
import EmailVerify from "./../Modals/EmailVerify";
import { Link } from "react-router-dom";
import BanglaBazarApi from "./../../../Api/BanglaBazarApi";

import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Dropdown,
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  NavbarText,
} from "reactstrap";

function TopBar() {
  var { signin, setSignin, signup, setSignup } = useContext(MODAL_CONTEXT);

  // const [signin, setSignIn] = useState(signin);
  // const [signup, setSignUp] = useState(signup);
  const [otpmodal, setOtpModal] = useState(false);
  const [show, setShow] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const [collapsed, setCollapsed] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [Region, setRegion] = useState(
    localStorage.getItem("region") ? localStorage.getItem("region") : null
  );
  const toggleNav = () => setIsOpen(!isOpen);
  var history = useHistory();
  var location = useLocation();
  var param = useParams().toggle;
  // console.log(location);
  useEffect(() => {
    setCurrentUser(CurrentUser);
    if (CurrentUser) getUserNotification();
    if (location.pathname.includes("/home")) {
      // setSignIn(true);
      setSignin(true);
    }
  }, []);
  var reload = () => {
    window.location.reload();
  };
  var getUserNotification = async () => {
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/admin/notifications`
      );
      setNotifications(response.data.notifications);
    } catch (e) {
      // console.log(e);
    }
  };
  var logout = async () => {
    await BanglaBazarApi.post(`${Endpoint}/api/user/logout`, {
      SessionID: localStorage.getItem("accessToken"),
    });
    setTimeout(() => {
      localStorage.clear();
      window.location.href = "/";
    }, 1500);
  };
  return (
    <div className="landing-topbar">
      <Container>
        <Navbar
          expand="md"
          light
          style={{
            backgroundColor: "#f5f6f8",
            boxShadow: "none",
            marginBottom: "0px",
            padding: "0px 8px",
          }}
        >
          <NavbarToggler onClick={toggleNav} />
          <Collapse isOpen={isOpen} navbar>
            <Container>
              <Nav className="mr-auto align-items-center" navbar>
                {/* <NavItem className="my-auto d-md-none d-none d-lg-block">
                  <span className="lt-divider"></span>
                </NavItem> */}
                <NavItem>
                  <NavLink href="#" style={{ paddingTop: "10px" }}>
                    <UncontrolledButtonDropdown direction="bottom">
                      <DropdownToggle
                        className="btn-light bg-none"
                        style={{
                          background: "transparent",
                          padding: "2px 2px",
                        }}
                      >
                        {Region === "Bangladesh" ? (
                          <img src="https://img.icons8.com/color/30/000000/bangladesh.png" />
                        ) : (
                          <img src="https://img.icons8.com/color/30/000000/usa.png" />
                        )}{" "}
                        <i className="fas fa-chevron-down text-dark"></i>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem
                          onClick={() => {
                            localStorage.setItem("region", "United States");
                            setTimeout(() => {
                              window.location.reload();
                            }, 1500);
                          }}
                        >
                          <img src="https://img.icons8.com/color/30/000000/usa.png" />{" "}
                          USA
                        </DropdownItem>

                        <DropdownItem
                          onClick={() => {
                            localStorage.setItem("region", "Bangladesh");
                            setTimeout(() => {
                              window.location.reload();
                            }, 1500);
                          }}
                        >
                          <img src="https://img.icons8.com/color/30/000000/bangladesh.png" />{" "}
                          BAN
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledButtonDropdown>
                  </NavLink>
                </NavItem>
                <NavItem className="my-auto d-md-none d-none d-lg-block">
                  <span className="lt-divider"></span>
                </NavItem>
                <NavItem>
                  <Link
                    to="/"
                    className="text-default nav-link"
                    style={{ paddingTop: "10px" }}
                  >
                    {" "}
                    Home
                  </Link>
                </NavItem>
              </Nav>
            </Container>
            <NavbarText
              className="d-flex"
              style={{
                minWidth: "25%",
                alignItems: "inherit",
                flexDirection: "row-reverse",
              }}
            >
              {currentUser &&
                (currentUser.Admin === "Y" ||
                  currentUser.SuperAdmin === "Y" ||
                  currentUser.Vendor === "Y") && (
                  <>
                    <ListInlineItem>
                      {(currentUser.Admin === "Y" ||
                        currentUser.SuperAdmin === "Y" ||
                        currentUser.Vendor === "Y") && (
                          <span
                            className=" p-1"
                            onClick={() => history.push("/panel/dashboard")}
                          >
                            <i
                              className="fas fa-user-alt"
                              style={{ fontSize: "16px", cursor: "pointer" }}
                              onClick={() => history.push("/panel/dashboard")}
                            ></i>
                          </span>
                        )}
                      <span
                        className="fa-stack has-badge"
                        data-count={notifications.length}
                      >
                        <Dropdown
                          isOpen={dropdownOpen}
                          toggle={toggle}
                          direction="left"
                        >
                          <DropdownToggle
                            style={{ backgroundColor: "transparent" }}
                          >
                            <i
                              className="fa fa-bell text-secondary"
                              style={{ fontSize: "16px" }}
                            ></i>
                          </DropdownToggle>
                          <DropdownMenu className="notification-menu">
                            {notifications.length > 0 ? (
                              notifications.map((item, index) => (
                                <DropdownItem
                                  key={index}
                                  className={
                                    item.NotificationStatus === "unread"
                                      ? "bg-light mt-1"
                                      : "bg-none mt-1"
                                  }
                                >
                                  <div
                                    data-letters="AD"
                                  // onClick={() =>
                                  //   history.push("/panel/dashboard")
                                  // }
                                  >
                                    {" "}
                                    {item.TypeID === 6 && (
                                      <span
                                        onClick={() =>
                                          history.push(
                                            `/order-details/${JSON.parse(item.Body).OrderNumber
                                            }`
                                          )
                                        }
                                      >
                                        {/* {JSON.parse(item.Body).Body} with order
                                        number{" "} */}
                                        <span
                                          className="text-dark"
                                          style={{ fontSize: "12px" }}
                                        >
                                          {JSON.parse(item.Body).body}
                                        </span>
                                      </span>
                                    )}
                                    {item.TypeID === 7 && (
                                      <span
                                        onClick={() =>
                                          history.push(
                                            `/user/order-refund-reciept/${JSON.parse(item.Body).OrderNumber
                                            }/${JSON.parse(item.Body).status
                                            }/${JSON.parse(item.Body).type
                                            }`
                                          )
                                        }
                                      >
                                        {/* {JSON.parse(item.Body).Body} with order
                                        number{" "} */}
                                        <span
                                          className="text-dark"
                                          style={{ fontSize: "12px" }}
                                        >
                                          {JSON.parse(item.Body).body}
                                        </span>
                                      </span>
                                    )}
                                    {item.TypeID === 8 && (
                                      <span
                                        onClick={() => window.open(`${Endpoint}/${JSON.parse(item.Body).path}`, '_blank')}
                                      >
                                        <span
                                          className="text-dark"
                                          style={{ fontSize: "12px" }}
                                        >
                                          {JSON.parse(item.Body).body}
                                        </span>
                                      </span>
                                    )}
                                    {/* {item.Body} */}
                                  </div>
                                </DropdownItem>
                              ))
                            ) : (
                              <DropdownItem>
                                <div>No Data Found</div>
                              </DropdownItem>
                            )}
                          </DropdownMenu>
                        </Dropdown>
                      </span>
                    </ListInlineItem>
                    <span
                      className="lt-divider"
                      style={{ marginRight: "10px" }}
                    ></span>
                  </>
                )}
              {currentUser ? (
                <>
                  <ListInlineItem>
                    <span className="lt-text" style={{ cursor: "pointer" }}>
                      <UncontrolledButtonDropdown direction="center">
                        <DropdownToggle
                          className=" btn-light text-default"
                          style={{ fontSize: "13px" }}
                        >
                          Welcome, {currentUser.UserName.split(" ")[0]}{" "}
                          <i
                            className="fas fa-chevron-down text-dark "
                            style={{ fontSize: "13px" }}
                          ></i>
                        </DropdownToggle>
                        <DropdownMenu className="landing-nav-toggle">
                          <DropdownItem
                            onClick={() => {
                              history.push(`/user-profile/${currentUser.UserID}`);
                            }}
                          >
                            Profile
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => history.push("/my-chats")}
                          >
                            Chats
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              logout();
                            }}
                          >
                            Logout
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledButtonDropdown>
                    </span>
                  </ListInlineItem>
                </>
              ) : (
                <ListInlineItem>
                  <span
                    className="lt-text"
                    style={{ cursor: "pointer" }}
                    onClick={() => setSignin(!signin)}
                  >
                    <i className="far fa-user text-default user-icon"></i>Sign
                    in/Register
                  </span>
                </ListInlineItem>
              )}
            </NavbarText>
          </Collapse>
        </Navbar>
      </Container>

      <Signin
        signin={signin}
        setSignIn={setSignin}
        signup={signup}
        setSignUp={setSignup}
        reload={reload}
      />
      <Signup
        signin={signin}
        setSignIn={setSignin}
        signup={signup}
        setSignUp={setSignup}
        otpmodal={otpmodal}
        setOtpModal={setOtpModal}
      />
      <OtpVerify
        otpmodal={otpmodal}
        setOtpModal={setOtpModal}
        signin={signin}
        setSignIn={setSignin}
      />
      <EmailVerify />
    </div>
  );
}
export default TopBar;
