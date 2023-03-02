// import Signin from "./Components/Pages/Signin";
import ComingSoon from "./Components/Pages/ComingSoon";
// import Signup from "./Components/Pages/Signup";
import AdminLayout from "./Components/Pages/Admin panel/Layout/AdminLayout";
import Landing from "./Components/Pages/Web App/Landing";
import AccessDenied from "./Components/Pages/AccessDenied";
import UserProfile from "./Components/Pages/Web App/UserProfile";
import ForgotPassword from "./Components/Pages/Web App/ForgotPassword";
import { EmailVerify } from "./Components/Pages/EmailVerification";
import Sell from "./Components/Pages/Web App/Sell";
import StoreDetail from "./Components/Pages/Web App/StoreDetail";
import { Test } from "./Components/Pages/Test";
import ProductDetails from "./Components/Pages/Web App/ProductDetails";
import UserCart from "./Components/Pages/Web App/UserCart";
import SearchedProducts from "./Components/Pages/Web App/Searched Products/SearchedProducts";
import GlobalSearchedProducts from "./Components/Pages/Web App/Searched Products/GlobalSearchedProducts";
import UserCartDeliveryDetails from "./Components/Pages/Web App/UserCartDeliveryDetails";
import MoreRecentViewed from "./Components/Pages/Web App/Layout/MoreRecentViewed";
import ViewMoreTrendingProducts from "./Components/Pages/Web App/Layout/MoreTrendingProducts";
import ViewMoreTopRatedProducts from "./Components/Pages/Web App/Layout/MoreTopRatedProducts";
import Wishlist from "./Components/Pages/Web App/Wishlist";
import PaymentCheckout from "./Components/Pages/Web App/PaymentCheckout";
import UserCartDetails from "./Components/Pages/Web App/UserCartDetails";
import OrderConfirmation from "./Components/Pages/Web App/OrderConfirmation";
import OrderDetails from "./Components/Pages/Web App/OrderDetails";
import OrderDetailByOrderNumber from "./Components/Pages/Web App/OrderDetailByOrderNumber";
import SupportChat from "./Components/Pages/Web App/Chat/SupportChat";
import IndividualChat from "./Components/Pages/Web App/Chat/IndividualChat";
import TestComp from "./Components/Pages/TestComp";
import AboutUs from "./Components/Pages/Web App/AboutUs";
import RefundAndReturnPolicy from "./Components/Pages/Web App/ReturnAndRefundPolicy";
import ContactUs from "./Components/Pages/Web App/ContactUs";
import PrivacyPolicy from "./Components/Pages/Web App/PrivacyPolicy";
import TermsAndCondition from "./Components/Pages/Web App/TermsAndCondition";
import PaymentAndDelivery from "./Components/Pages/Web App/Payment and Delivery/PaymentAndDelivery";
import RefundForm from "./Components/Pages/Web App/RefundForm";
import RefundInstruction from "./Components/Pages/Web App/RefundInstruction";
import StripePayment from "./Components/Pages/Web App/Payment and Delivery/StipePayment";
import { OrderInvoicePrint } from "./Components/Pages/Web App/Order Detail Component/OrderInvoicePrint";
import { UserRefundReceiptDetails } from "./Components/Pages/Admin panel/Pages/UserRefundRecieptDetails";

var routes = [
  // {
  //   path: "/",
  //   name: "coming soon",
  //   component: ComingSoon,
  //   exact: true,
  // },
  {
    path: "/",
    name: "landing",
    component: Landing,
    exact: true,
    protect: false,
  },
  {
    path: "/home/:toggle",
    name: "landing",
    component: Landing,
    exact: true,
    protect: false,
  },
  {
    path: "/forgot-password",
    name: "forgotpassword",
    component: ForgotPassword,
    exact: true,
    protect: false,
  },
  {
    path: "/sell",
    name: "sell",
    component: Sell,
    exact: true,
    protect: false,
  },
  {
    path: "/user-profile/:id",
    name: "userProfile",
    component: UserProfile,
    exact: true,
    protect: true,
  },
  // {
  //   path: "/signin",
  //   name: "signin",
  //   component: Signin,
  //   exact: true,
  // },
  // {
  //   path: "/signup",
  //   name: "signup",
  //   component: Signup,
  //   exact: true,
  // },
  {
    path: "/panel/*",
    name: "adminlayout",
    component: AdminLayout,
    exact: true,
    protect: true,
  },
  {
    path: "/access-denied",
    name: "accessdenied",
    component: AccessDenied,
    exact: true,
    protect: false,
  },
  {
    path: "/verify-email/:email",
    name: "verifyemail",
    component: EmailVerify,
    exact: true,
    protect: false,
  },
  // {
  //   path: "/test",
  //   name: "test",
  //   component: Test,
  //   exact: true,
  //   protect: false,
  // },
  { path: "/landing", name: "landing", component: Landing, exact: true },
  {
    path: "/store/:name",
    name: "storedetail",
    component: StoreDetail,
    exact: true,
  },
  {
    path: "/product-details/:productID",
    name: "productdetails",
    component: ProductDetails,
    exact: true,
  },
  {
    path: "/my-cart",
    name: "userCart",
    component: UserCart,
    exact: true,
    protect: true,
  },
  {
    path: "/my-cart/delivery-details",
    name: "PaymentAndDelivery",
    // component: UserCartDeliveryDetails,
    component: PaymentAndDelivery,
    exact: true,
  },
  {
    path: "/my-cart/order-details/:paymentStatus/:paymentType",
    name: "orderDetails",
    component: UserCartDetails,
    exact: true,
  },
  {
    path: "/search-products/:mode/:id",
    name: "searchProducts",
    component: SearchedProducts,
    exact: true,
  },
  {
    path: "/search/global/products/:categoryId",
    name: "globalSearchedProducts",
    component: GlobalSearchedProducts,
    exact: true,
  },
  {
    path: "/recently-viewed/products",
    name: "recentlyViewed",
    component: MoreRecentViewed,
    exact: true,
  },
  {
    path: "/trending-for-you",
    name: "trendingForYou",
    component: ViewMoreTrendingProducts,
    exact: true,
  },
  {
    path: "/top-rated/products",
    name: "topRatedProducts",
    component: ViewMoreTopRatedProducts,
    exact: true,
  },
  {
    path: "/my-wishlist",
    name: "myWishlist",
    component: Wishlist,
    exact: true,
  },
  {
    path: "/payment-checkout",
    name: "paymentCheckout",
    component: PaymentCheckout,
    exact: true,
  },
  {
    path: "/order-confirmation/:orderID",
    name: "orderConfirmation",
    component: OrderConfirmation,
    exact: true,
  },
  {
    path: "/order-details",
    name: "orderDetails",
    component: OrderDetails,
    exact: true,
  },
  {
    path: "/order-details/:orderNumber",
    name: "orderDetails",
    component: OrderDetailByOrderNumber,
    exact: true,
  },
  {
    path: "/my-chats",
    name: "chatSupport",
    component: SupportChat,
    exact: true,
  },
  {
    path: "/chat-support/:reciever_id",
    name: "chatSupport",
    component: IndividualChat,
    exact: true,
  },
  {
    path: "/test_comp",
    name: "testComp",
    component: TestComp,
    exact: false,
  },
  {
    path: "/about-us",
    name: "AboutUs",
    component: AboutUs,
    exact: true,
  },
  {
    path: "/refund-and-return",
    name: "RefundAndReturn",
    component: RefundAndReturnPolicy,
    exact: true,
  },
  {
    path: "/contact-us",
    name: "ContactUs",
    component: ContactUs,
    exact: true,
  },
  {
    path: "/privacy-policy",
    name: "PrivacyPolicy",
    component: PrivacyPolicy,
    exact: true,
  },
  {
    path: "/terms-conditions",
    name: "TermsCondition",
    component: TermsAndCondition,
    exact: true,
  },
  {
    path: "/request-refund/:orderNumber",
    name: "Request Refund",
    exact: true,
    component: RefundForm,
  },
  {
    path: "/request-refund-link/:orderNumber/:total/:products",
    name: "Request Refund Instructions",
    exact: true,
    component: RefundInstruction,
  },
  {
    path: "/stripe-checkout/:orderNumber/:currency/:price/:cus_id",
    name: "StripeCheckout",
    component: StripePayment,
    exact: true,
  },
  {
    path: "/order-invoice/:orderNumber",
    name: "OrderInvoice",
    component: OrderInvoicePrint,
    exact: true,
  },
  {
    path: "/user/order-refund-reciept/:orderNumber/:status/:type",
    name: "RefundReciept",
    component: UserRefundReceiptDetails,
    exact: true,
  },
];
export default routes;
