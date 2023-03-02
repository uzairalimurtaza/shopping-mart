import { useEffect, useState } from "react";
import logo from "../../../../assets/images/logo.png";
import SidebarLinks from "./sidebarLinks";
import { Link, useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Endpoint from "./../../../../Utils/Endpoint";
// import axios from "axios";
import { CurrentUser } from "./../../../../Helpers/Auth";
import BanglaBazarApi from "./../../../Api/BanglaBazarApi";

import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
function AdminSidebar(props) {
  let history = useHistory();
  const [ProfilePic, setProfilePic] = useState(null);
  let location = useLocation();
  var pathname = location.pathname;
  const [close, setClose] = useState(false);
  useEffect(() => {
    setClose(props.toggle);
  }, [props.toggle]);
  useEffect(() => {
    getUserInfo();
  }, []);
  var getRoles = (record) => {
    var array = [];

    if (record.Admin === "Y") {
      array.push("Admin");
    }
    if (record.Customer === "Y") {
      array.push("Customer");
    }
    if (record.Vendor === "Y") {
      array.push("Vendor");
    }
    if (record.DeliveryPerson === "Y") {
      array.push("Delivery Person");
    }
    if (record.SuperAdmin === "Y") {
      array.push("Super Admin");
    }

    return array.toString();
  };
  var getUserInfo = async () => {
    var { UserID } = JSON.parse(localStorage.getItem("user"));
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/admin/get/${UserID}`
      );
      let data = response.data.profile;

      setProfilePic(data.ProfilePic);
    } catch (e) {
      console.log(e);
    }
  };
  var logout = async () => {
    await BanglaBazarApi.post(`${Endpoint}/api/user/logout`, {
      SessionID: localStorage.getItem("accessToken"),
    });
    localStorage.clear();
    toast.success("Logging out...", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    setTimeout(() => {
      window.location.href = `/`;
    }, 3000);
  };
  return (
    <nav
      id="sidebar"
      style={{
        minWidth: close && "0px ",
        maxWidth: close && "0px ",
      }}
    >
      <div className="sidebar-header text-center active">
        <img className="img-fluid sidebar-logo" src={logo} alt="logo" />
      </div>
      <div className="sidebar-profile justify-content-between  mt-5">
        <div className="d-flex">
          <div>
            <img
              className="img-fluid avatar"
              src={
                !ProfilePic || ProfilePic.length < 1
                  ? "http://cdn.onlinewebfonts.com/svg/img_383212.png"
                  : `${Endpoint}/${ProfilePic}`
              }
              alt="profile"
            />
          </div>
          <div style={{ paddingLeft: "15px" }}>
            <div>
              <h6 className="text-dark" style={{ fontSize: "15px" }}>
                {CurrentUser.UserName}
              </h6>
            </div>
            <div className="text-secondary admin-name">
              {getRoles(CurrentUser)}
            </div>
          </div>
        </div>
        <div>
          <UncontrolledButtonDropdown direction="left">
            <DropdownToggle className=" btn-light">
              <i className="fas fa-chevron-down text-dark"></i>
            </DropdownToggle>
            <DropdownMenu className="admin-nav-toggle">
              {/* <DropdownItem>View</DropdownItem> */}
              <DropdownItem onClick={() => logout()}>Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </div>
      </div>
      <ul className="list-unstyled components">
        <div className="component-p mt-4">MAIN MODULE</div>
        {SidebarLinks.map(
          (link, index) =>
            link && (
              <li
                className={pathname === link.path ? "active" : ""}
                key={index}
              >
                <Link to={link.path} className="sidebarLink">
                  <div className="row">
                    <div className="col-2 text-center">{link.icon}</div>
                    <div className="col-10">{link.title}</div>
                  </div>
                </Link>
              </li>
            )
        )}
      </ul>
    </nav>
  );
}
export default AdminSidebar;
