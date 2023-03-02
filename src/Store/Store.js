import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  CategorySubCategoryReducer,
  IPReducer,
  LandingPageReducer,
} from "./../Reducers/LandingReducers";
import {
  ProductsByGlobalSearchReducer,
  ProductsByIdReducer,
  ProductDetailByIdReducer,
  ViewMoreRecentlyViewed,
} from "./../Reducers/ProductReducer";
import {
  WishList_Reducer,
  Remove_WishList_Reducer,
} from "./../Reducers/WishlistReducer";
import {
  AddCartItemReducer,
  GetCartItemReducer,
  RemoveCartItemReducer,
} from "./../Reducers/CartReducer";
import { PaymentStatusReducer } from "./../Reducers/PaymentReducer";
import { GetOrderDetailsReducer } from "./../Reducers/CartDetailsReducer";

const reducer = combineReducers({
  categoriesAndSubcategories: CategorySubCategoryReducer,
  productsBySubCategoryId: ProductsByIdReducer,
  productsByCategoryId: ProductsByIdReducer,
  productsByGlobalSearch: ProductsByGlobalSearchReducer,
  currentIPv4: IPReducer,
  productsDetailById: ProductDetailByIdReducer,
  landingPage: LandingPageReducer,
  moreRecentlyViewed: ViewMoreRecentlyViewed,
  userWishList: WishList_Reducer,
  removeWishListItem: Remove_WishList_Reducer,
  addCartItem: AddCartItemReducer,
  getCartItem: GetCartItemReducer,
  removeCartItem: RemoveCartItemReducer,
  paymentStatus: PaymentStatusReducer,
  userOrderDetails: GetOrderDetailsReducer,
});
const middleware = [thunk];
const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
