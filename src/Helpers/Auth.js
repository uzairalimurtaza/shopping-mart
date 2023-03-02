import { toast } from "react-toastify";

export const CurrentUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

export const SignOut = () => {
  toast.info("Logging out...", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
  localStorage.clear();
  sessionStorage.clear();
  setTimeout(() => {
    window.location.href = "/";
  }, 3000);
};
export const isAdmin = () => {
  var currentUser = CurrentUser;
  if (!currentUser) {
    return false;
  }
  if (
    currentUser.Admin === "Y" ||
    currentUser.SuperAdmin === "Y" ||
    currentUser.Vendor === "Y"
  ) {
    return true;
  }
  return false;
};
export const isCurrentUser = () => {
  if (!CurrentUser || CurrentUser == null || CurrentUser === undefined) {
    return false;
  } else {
    return true;
  }
};
export const getRoles = () => {
  var record = CurrentUser;
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
