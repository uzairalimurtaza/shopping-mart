import { ToastContainer } from "react-toastify";
import TopBar from "./TopBar";
import LandingNavbar from "./LandingNavbar";
import NavMenu from "./NavMenu";
// import { CurrentUser } from "../../../../Helpers/Auth";
import { PhoneVerificationAlert } from "./PhoneVerificationAlert";
import { useLocation } from "react-router-dom";
export function WebsiteHeader() {
  const location = useLocation();

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <TopBar />
      <PhoneVerificationAlert />
      {location.pathname !== "/my-chats" && (
        <>
          <LandingNavbar />
          <NavMenu />
        </>
      )}
    </>
  );
}
