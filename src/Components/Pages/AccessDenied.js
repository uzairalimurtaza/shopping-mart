import logo from "../../assets/images/logo.png";
import accessdenied from "../../assets/images/accessdenied.png";
function AccessDenied() {
  return (
    <div className="container">
      <div className="mt-5 mb-5">
        <img src={logo} className="logo" />
      </div>
      <div className="row pt-5">
        <div className="col-md-8 m-auto text-center">
          <img src={accessdenied} className="img-fluid" />
          <h1 style={{ fontSize: "52px" }} className="mt-4">
            Access Denied
          </h1>
          <p
            className="default-p mt-3"
            style={{ fontSize: "20px", fontWeight: "400" }}
          >
            You are not authorized to access this application. For assistance,
            please contact your system administrator.
          </p>
          <div>
            <button
              className="btn-default btn-notify-curved pl-4 pr-4"
              onClick={() => (window.location.href = "/")}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AccessDenied;
