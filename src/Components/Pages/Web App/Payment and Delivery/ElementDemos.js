import React from "react";
import {
  Switch,
  Route,
  Redirect,
  useLocation,
  useHistory,
} from "react-router-dom";
import SplitForm from "./SplitForm";

const ElementDemos = ({ demos }) => {
  const location = useLocation();
  const history = useHistory();

  return (
    <div className="DemoWrapper" style={{ backgroundColor: "#EEEEEE" }}>
      <SplitForm />
    </div>
  );
};

export default ElementDemos;
