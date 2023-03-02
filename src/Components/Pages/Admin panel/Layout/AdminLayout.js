import { Route } from "react-router-dom";
import AdminRoutes from "./routes";
import AdminSidebar from "./Sidebar";
import AdminNavbar from "./Navbar";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import AdminRoute from "../../../../Helpers/AdminRoute";

function AdminLayout() {
  const [toggle, toggleSidebar] = useState(false);
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="wrapper">
        <AdminSidebar toggle={toggle} toggleSidebar={toggleSidebar} />

        <div
          id="content"
          style={{
            left: toggle && "0",
            width: toggle && "100%",
          }}
        >
          <AdminNavbar toggle={toggle} toggleSidebar={toggleSidebar} />

          {AdminRoutes.map((route, index) => (
            <AdminRoute
              path={route.path}
              key={index}
              component={route.component}
              exact
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export default AdminLayout;
