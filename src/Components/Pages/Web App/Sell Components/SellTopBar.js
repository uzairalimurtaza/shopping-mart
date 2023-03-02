import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Dropdown,
  Collapse,
  Navbar,
  NavbarToggler,
  Container,
  ListInlineItem,
  Nav,
  NavItem,
  NavLink,
  NavbarText,
} from "reactstrap";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import BanglaBazarApi from "./../../../Api/BanglaBazarApi";
import Endpoint from "./../../../../Utils/Endpoint";

function SellTopBar() {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const toggleNav = () => setIsOpen(!isOpen);
  var logout = async () => {
    await BanglaBazarApi.post(`${Endpoint}/api/user/logout`, {
      SessionID: localStorage.getItem("accessToken"),
    });
   await setTimeout(() => {
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
            <Container></Container>
            <NavbarText
              className="d-flex"
              style={{
                minWidth: "25%",
                alignItems: "inherit",
                flexDirection: "row-reverse",
              }}
            >
              <ListInlineItem>
                <span className="lt-text" style={{ cursor: "pointer" }}>
                  <UncontrolledButtonDropdown direction="center">
                    <DropdownToggle
                      className=" btn-light text-default"
                      style={{ fontSize: "13px" }}
                    >
                      Settings
                      <i
                        className="fas fa-chevron-down text-dark "
                        style={{ fontSize: "13px" }}
                      ></i>
                    </DropdownToggle>

                    <DropdownMenu className="landing-nav-toggle">
                      <DropdownItem
                        onClick={() => {
                          history.push("/");
                        }}
                      >
                        Home
                      </DropdownItem>
                      <DropdownItem
                        onClick={logout}
                      >
                        Logout
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledButtonDropdown>
                </span>
              </ListInlineItem>
            </NavbarText>
          </Collapse>
        </Navbar>
      </Container>
    </div>
  );
}
export default SellTopBar;
