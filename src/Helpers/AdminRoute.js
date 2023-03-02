import React from "react";
import { Route } from "react-router-dom";
import { isAdmin } from "./Auth";
const AdminRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAdmin() === true ? (
          <Component {...props} />
        ) : (
          (window.location.href = "/access-denied")
        )
      }
    />
  );
};

export default AdminRoute;
