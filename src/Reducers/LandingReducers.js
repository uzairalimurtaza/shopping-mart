import {
  CATEGORY_REQUEST_SUCCESS,
  CATEGORY_REQUEST_PENDING,
  CATEGORY_REQUEST_FAILED,
  IP_REQUEST_SUCCESS,
  IP_REQUEST_PENDING,
  IP_REQUEST_FAILED,
  LANDING_REQUEST_SUCCESS,
  LANDING_REQUEST_PENDING,
  LANDING_REQUEST_FAILED,
} from "../Constants/Constants";

export const LandingPageReducer = (
  state = {
    data: [],
    loading: true,
  },
  action
) => {
  switch (action.type) {
    case LANDING_REQUEST_PENDING:
      return state;
    case LANDING_REQUEST_SUCCESS:
      return {
        data: action.payload,
        loading: false,
      };
    case LANDING_REQUEST_FAILED:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
export const CategorySubCategoryReducer = (
  state = {
    categoriesAndSubCategories: [],
    loading: true,
  },
  action
) => {
  switch (action.type) {
    case CATEGORY_REQUEST_PENDING:
      return { loading: true, categoriesAndSubCategories: [] };
    case CATEGORY_REQUEST_SUCCESS:
      return {
        categoriesAndSubCategories: action.payload,
        loading: false,
      };
    case CATEGORY_REQUEST_FAILED:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const IPReducer = (
  state = {
    IP: {},
    loading: true,
  },
  action
) => {
  switch (action.type) {
    case IP_REQUEST_PENDING:
      return { loading: true, IP: {} };
    case IP_REQUEST_SUCCESS:
      return {
        IP: action.payload,
        loading: false,
      };
    case IP_REQUEST_FAILED:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
