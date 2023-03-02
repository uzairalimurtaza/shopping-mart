import React from "react";
import { Route } from "react-router-dom";
import { isCurrentUser } from "./Auth";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isCurrentUser() === true ? (
          <Component {...props} />
        ) : (
          (window.location.href = "/access-denied")
        )
      }
    />
  );
};

export default ProtectedRoute;
