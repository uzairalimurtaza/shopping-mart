import {
  PRODUCT_REQUEST_SUCCESS,
  PRODUCT_REQUEST_PENDING,
  PRODUCT_REQUEST_FAILED,
  RECENTLY_VIEWED_REQUEST_SUCCESS,
  RECENTLY_VIEWED_REQUEST_PENDING,
  RECENTLY_VIEWED_REQUEST_FAILED,
} from "../Constants/Constants";

export const ProductDetailByIdReducer = (
  state = {
    data: [],
    loading: true,
  },
  action
) => {
  switch (action.type) {
    case PRODUCT_REQUEST_PENDING:
      return { loading: true, data: [] };
    case PRODUCT_REQUEST_SUCCESS:
      return {
        data: action.payload,
        loading: false,
      };
    case PRODUCT_REQUEST_FAILED:
      return {
        loading: false,
        data: [],
        error: action.payload,
      };
    default:
      return state;
  }
};

export const ProductsByIdReducer = (
  state = {
    data: [],
    loading: true,
  },
  action
) => {
  switch (action.type) {
    case PRODUCT_REQUEST_PENDING:
      return { loading: true, data: [] };
    case PRODUCT_REQUEST_SUCCESS:
      return {
        data: action.payload,

        loading: false,
      };
    case PRODUCT_REQUEST_FAILED:
      return {
        loading: false,
        data: [],
        error: action.payload,
      };
    default:
      return state;
  }
};
export const ProductsByGlobalSearchReducer = (
  state = {
    data: [],
    loading: true,
  },
  action
) => {
  switch (action.type) {
    case PRODUCT_REQUEST_PENDING:
      return { loading: true, data: [] };
    case PRODUCT_REQUEST_SUCCESS:
      return {
        data: action.payload,

        loading: false,
      };
    case PRODUCT_REQUEST_FAILED:
      return {
        loading: false,
        data: [],
        error: action.payload,
      };
    default:
      return state;
  }
};
export const ViewMoreRecentlyViewed = (
  state = {
    data: [],
    loading: true,
  },
  action
) => {
  switch (action.type) {
    case RECENTLY_VIEWED_REQUEST_PENDING:
      return { loading: true, data: [] };
    case RECENTLY_VIEWED_REQUEST_SUCCESS:
      return {
        data: action.payload,

        loading: false,
      };
    case RECENTLY_VIEWED_REQUEST_FAILED:
      return {
        loading: false,
        data: [],
        error: action.payload,
      };
    default:
      return state;
  }
};
