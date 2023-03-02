import UserManagement from "./../Pages/UserManagement";
import UpdateUserInfo from "./../Pages/UpdateUser";
import StoreManagement from "./../Pages/StoreManagement";
import CreateStore from "./../Pages/CreateStore";
import VendorBusinessStoreDetail from "./../Pages/VendorBusinessStoreDetail";
import UpdateSingleStore from "./../Pages/UpdateSingleStore";
import DepartmentManagement from "./../Pages/DepartmentManagement";
import DepartmentCategories from "./../Pages/DepartmentCategories";
import DepartmentSubCategories from "./../Pages/DepartmentSubCategories";
import SubCategoryManagement from "./../Pages/SubCategoryManagement";
import ProductManagement from "./../Pages/ProductManagement";
import ProductManagementAll from "./../Pages/ProductManagementAll";
import ProductForm from "./../Pages/ProductForm";
import PanelDashboad from "./../Pages/Dashboard";
import OtherSettings from "./../Pages/Others";
import CountryList from "./../Pages/Country Management/CountryList";
import StateList from "./../Pages/Country Management/StateList";
import CityList from "./../Pages/Country Management/CityList";
import PaymentGateway from "./../Pages/Payment Gateway/PaymentGateway";
import VendorManagement from "./../Pages/Vendor Management/VendorManagement";
import EditProductPage from "./../Pages/Edit Product/EditProductPage";
import OrderManagement from "./../Pages/Order Management/OrderManagement";
import OrderProductDetail from "./../Pages/Order Management/OrderProductDetails";
import OrderDetailUsps from "./../Pages/Order Management/OrderDetailUsps";
import AdminOrderManagement from "./../Pages/Order Management/Admin Order Management/AdminOrderManagement";
import AdminInvoice from "./../Pages/Order Management/Admin Order Management/AdminInvoice";
import PaymentManagement from "./../Pages/Payment Management/PaymentManagement";
import RefundDetails from "./../Pages/RefundDetails";
import { CourierServices } from "../Pages/Courier Services/CourierServices";
import { VendorDeliveryForm } from "../Pages/Order Management/VendorDeliveryForm";
import { PayToVendor } from "../Pages/Pay To Vendor/PayToVendor";
import { SearchAndPayToVendor } from "../Pages/Pay To Vendor/SearchAndPayToVendor";
import { VendorPaymentHistory } from "../Pages/Pay To Vendor/VendorPaymentHistory";
import { DriverPayments } from "../Pages/Driver Payments/DriverPayments";
import { PayToDriver } from "../Pages/Pay To Driver/PayToDriver";
import { SearchAndPayToDriver } from "../Pages/Pay To Driver/SearchAndPayToDriver";
import { DriverPaymentHistory } from "../Pages/Pay To Driver/DriverPaymentHistory";
import { VendorRefunds } from "../Pages/Vendor Refund Management/VendorRefunds";
import ConfirmedRefunds from "../Pages/Confirmed Refunds/ConfiremedRefunds";

var AdminRoutes = [
  {
    path: "/panel/userManagement",
    name: "userManagement",
    component: UserManagement,
  },
  {
    path: "/panel/userEdit/:id",
    name: "userName",
    component: UpdateUserInfo,
  },
  {
    path: "/panel/storeManagement",
    name: "StoreManagement",
    component: StoreManagement,
  },
  {
    path: "/panel/createStore/:id",
    name: "CreateStore",
    component: CreateStore,
  },
  {
    path: "/panel/viewBusiness/:id",
    name: "ViewBusiness",
    component: VendorBusinessStoreDetail,
  },
  {
    path: "/panel/update-single-store/:index/:id/:businessEmail",
    name: "UpdateSingleStore",
    component: UpdateSingleStore,
  },
  {
    path: "/panel/departments",
    name: "DepartmentManagement",
    component: DepartmentManagement,
  },
  {
    path: "/panel/department-categories/:id/:name",
    name: "DepartmentCategories",
    component: DepartmentCategories,
  },
  {
    path: "/panel/department-subcategories/:id/:name/:deptID",
    name: "DepartmentSubCategories",
    component: DepartmentSubCategories,
  },
  {
    path: "/panel/vendor/subcategories",
    name: "VendorSubcategories",
    component: SubCategoryManagement,
  },
  {
    path: "/panel/product-management",
    name: "ProductManagement",
    component: ProductManagement,
  },
  {
    path: "/panel/product-management/all",
    name: "ProductManagementAll",
    component: ProductManagementAll,
  },
  {
    path: "/panel/vendor/create-product",
    name: "ProductForm",
    component: ProductForm,
  },
  {
    path: "/panel/vendor/edit-product/:productID/:vendorID",
    name: "EditProductForm",
    component: EditProductPage,
  },
  {
    path: "/panel/dashboard",
    name: "Dashboard",
    component: PanelDashboad,
  },
  {
    path: "/panel/other-settings",
    name: "Others",
    component: OtherSettings,
  },
  {
    path: "/panel/country-list",
    name: "CountryList",
    component: CountryList,
  },
  {
    path: "/panel/state-list/:CountryID",
    name: "StateList",
    component: StateList,
  },
  {
    path: "/panel/city-list/:StateID/:CountryID",
    name: "CityList",
    component: CityList,
  },
  {
    path: "/panel/payment-gateway",
    name: "PaymentGateway",
    component: PaymentGateway,
  },
  {
    path: "/panel/vendor-management",
    name: "VendorManagement",
    component: VendorManagement,
  },
  {
    path: "/panel/order-management",
    name: "OrderManagement",
    component: OrderManagement,
  },
  {
    path: "/panel/order-management/:orderNumber/:type",
    name: "OrderNumber",
    component: OrderProductDetail,
  },
  {
    path: "/panel/usps-order-management/:orderNumber",
    name: "OrderManagementUSPS",
    component: OrderDetailUsps,
    exact: true,
  },
  {
    path: "/panel/vendor-delivery/:orderNumber",
    name: "VendorDeliveryForm",
    component: VendorDeliveryForm,
    exact: true,
  },
  {
    path: "/panel/admin/order-management",
    name: "AdminOrderManagement",
    component: AdminOrderManagement,
  },
  {
    path: "/panel/admin/order-detail/:orderNumber",
    name: "OrderNumberWithDetail",
    component: AdminInvoice,
  },
  {
    path: "/panel/admin/payment-management",
    name: "PaymentManagement",
    component: PaymentManagement,
  },
  {
    path: "/panel/vendor/confirmed-refunds",
    name: "PaymentManagement",
    component: ConfirmedRefunds,
  },
  {
    path: "/panel/admin/refund-details/:orderNumber/:status/:type",
    name: "Refund Details",
    exact: true,
    component: RefundDetails,
  },
  {
    path: "/panel/courier-services",
    name: "Courier Services",
    exact: true,
    component: CourierServices,
  },
  {
    path: "/panel/pay-to-vendor",
    name: "Pay To Vendor",
    exact: true,
    component: PayToVendor,
  },
  {
    path: "/panel/search/pay-to-vendor",
    name: "Search Pay To Vendor",
    exact: true,
    component: SearchAndPayToVendor,
  },
  {
    path: "/panel/vendor-payments/:vendorId",
    name: "Vendor Payments",
    exact: true,
    component: VendorPaymentHistory,
  },
  {
    path: "/panel/driver-payments",
    name: "Driver Payments",
    exact: true,
    component: DriverPayments,
  },
  {
    path: "/panel/pay-to-driver",
    name: "Pay To Driver",
    exact: true,
    component: PayToDriver,
  },
  {
    path: "/panel/search/pay-to-driver",
    name: "Search Pay To Driver",
    exact: true,
    component: SearchAndPayToDriver,
  },
  {
    path: "/panel/history/pay-to-driver/:driverId",
    name: "Search Pay To Driver",
    exact: true,
    component: DriverPaymentHistory,
  },
  {
    path: "/panel/vendor/refunds",
    name: "vendorRefunds",
    exact: true,
    component: VendorRefunds,
  },
];
export default AdminRoutes;
