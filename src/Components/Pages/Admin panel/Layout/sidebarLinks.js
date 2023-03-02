import { getRoles, CurrentUser } from "./../../../../Helpers/Auth";
var roles = CurrentUser ? getRoles() : null;
console.log(roles);
var SidebarLinks = roles
  ? [
      {
        title: "Dashboard",
        name: "dashboard",
        icon: <i className="fas fa-th-large"></i>,
        path: "/panel/dashboard",
      },
      roles.includes("Admin")
        ? {
            title: "User Management",
            name: "userManagement",
            icon: <i className="fas fa-users"></i>,
            path: "/panel/userManagement",
          }
        : null,
      roles.includes("Admin")
        ? {
            title: "Vendor Management",
            name: "vendorManagement",
            icon: <i className="fas fa-briefcase"></i>,
            path: "/panel/vendor-management",
          }
        : null,

      {
        title: "Store Management",
        name: "storeManagement",
        icon: <i className="fas fa-store-alt"></i>,
        path: "/panel/storeManagement",
      },
      roles.includes("Admin")
        ? {
            title: "Department Management",
            name: "departmentManagement",
            icon: <i className="far fa-building"></i>,
            path: "/panel/departments",
          }
        : null,
      {
        title: "Product Management",
        name: "productManagement",
        icon: <i className="fas fa-shopping-bag"></i>,
        path: "/panel/product-management",
      },
      roles.includes("Admin")
        ? {
            title: "Payment Gateways",
            name: "paymentGateways",
            icon: <i className="far fa-credit-card"></i>,
            path: "/panel/payment-gateway",
          }
        : null,
      {
        title: "Order/Delivery Management",
        name: "orderManagement",
        icon: <i className="fas fa-truck"></i>,
        path: "/panel/order-management",
      },
      roles.includes("Super")
        ? {
            title: "Refund Management",
            name: "refundManagement",
            icon: <i className="fal fa-sack-dollar"></i>,
            path: "/panel/admin/payment-management",
          }
        : null,
      roles.includes("Vendor") && !roles.includes("Super")
        ? {
            title: "Refund Management",
            name: "refundManagement",
            icon: <i className="fal fa-sack-dollar"></i>,
            path: "/panel/vendor/refunds",
          }
        : null,
      roles.includes("Super")
        ? {
            title: "Pay To Vendors",
            name: "payToVendors",
            icon: <i class="fas fa-cash-register"></i>,
            path: "/panel/pay-to-vendor",
          }
        : null,
      roles.includes("Super")
        ? {
            title: "Pay To Drivers",
            name: "payToDriver",
            icon: <i class="fas fa-motorcycle"></i>,
            path: "/panel/pay-to-driver",
          }
        : null,
      roles.includes("Admin")
        ? {
            title: "Driver Payments",
            name: "driverPayments",
            icon: <i class="fas fa-cash-register"></i>,
            path: "/panel/driver-payments",
          }
        : null,

      // {
      //   title: "Order/Delivery Management",
      //   name: "deliveryManagement",
      //   icon: <i className="fas fa-truck"></i>,
      //   path: "#",
      // },
      roles.includes("Admin")
        ? {
            title: "Settings",
            name: "others",
            icon: <i className="fas fa-cog"></i>,
            path: "/panel/other-settings",
          }
        : null,
    ]
  : [];

export default SidebarLinks;
