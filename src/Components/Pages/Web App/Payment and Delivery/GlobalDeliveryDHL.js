//import accessdenied from "../../../assets/images/accessdenied.png";
import accessdenied from "../../../../assets/images/accessdenied.png"
import logo from "../../../../assets/images/logo.png";
function GlobalDeliveryDHL() {
  return (
    <>
        <div className="mt-5">
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
                  We are currently working on Global Shipping. Sorry for inconvenience.Stay tuned we will shortly launch this feauture.
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
        </div>
      
    </>
  );
}
export default GlobalDeliveryDHL;

