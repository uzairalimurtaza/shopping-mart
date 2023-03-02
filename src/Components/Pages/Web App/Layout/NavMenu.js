import { Container, ListInlineItem, List } from "reactstrap";
import BrowseCategories from "./BrowseCategories";
import { useHistory } from "react-router-dom";
import { useContext } from "react";
import MODAL_CONTEXT from "../../../Contexts/ModalContext";
import { CurrentUser } from "../../../../Helpers/Auth";
import { Link, useLocation } from "react-router-dom";
import BrowseCategories2 from './BrowseCategories2';
function NavMenu() {
  const { pathname } = useLocation();

  const history = useHistory();
  const { signin, setSignin } = useContext(MODAL_CONTEXT);
  return (
    <Container>
      <div className="row align-items-baseline">
        <div className="col-xl-3 col-lg-6 col-md-12 mt-2">
          {/* <BrowseCategories /> */}
          <BrowseCategories2 />
        </div>
        <div className="col-xl-6 col-lg-6 col-md-12">
          <div
            className="d-flex justify-content-between"
            style={{ alignItems: "center" }}
          >
            <div
              className={
                pathname === "/" ? "nav-menu-item-active" : "nav-menu-item"
              }
            >
              <Link className="text-default td-none" to="/">
                Home
              </Link>
            </div>
            {/* <div className="nav-menu-item">Today's Best Deal</div> */}
            <div
              className={
                pathname === "/order-details"
                  ? "nav-menu-item-active"
                  : "nav-menu-item"
              }
            >
              <Link className="text-default td-none" to="/order-details">
                My Orders
              </Link>
            </div>
            <div
              className={
                pathname === "/sell"
                  ? "nav-menu-item-active"
                  : "nav-menu-item text-default"
              }
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (CurrentUser) {
                  history.push("/sell");
                } else {
                  setSignin(!signin);
                }
              }}
            >
              Become a Vendor
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-12 col-md-6 mt-2">
          <List type="inline" className="lt-un mt-0 mr-auto pb-0 mb-0 pt-3">
            <a href="https://play.google.com/store/apps" target="_blank">
              <ListInlineItem
                style={{ marginLeft: "5px", marginRight: "5px" }}
                className="nav-menu-item"
              >
                Get The App
              </ListInlineItem>
            </a>

            {/* <span className="lt-divider"></span>
            <ListInlineItem
              style={{ marginLeft: "5px", marginRight: "5px" }}
              className="nav-menu-item"
            >
              Feedback
            </ListInlineItem>
            <span className="lt-divider"></span>
            <ListInlineItem
              style={{ marginLeft: "5px", marginRight: "5px" }}
              className="nav-menu-item"
            >
              Help Center
            </ListInlineItem> */}
          </List>
        </div>
      </div>
    </Container>
  );
}
export default NavMenu;
