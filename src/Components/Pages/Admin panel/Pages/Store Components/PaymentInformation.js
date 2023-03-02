import { Collapse } from "reactstrap";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import ReactFlagsSelect from "react-flags-select";
function PaymentInformation() {
  const [Open, SetOpen] = useState(true);
  return (
    <div>
      <div className="card cstore-card">
        <div className="card-header d-flex justify-content-between cstore-cardheader mt-2 mb-2">
          <h6 className="ftw-400">Payment Information</h6>
          <button onClick={() => SetOpen(!Open)}>
            {Open ? (
              <i className="fas fa-angle-up text-default"></i>
            ) : (
              <i className="fas fa-angle-down text-default"></i>
            )}
          </button>
        </div>
        <Collapse isOpen={Open}>
          <div className="card-body mb-5">
            <div className="row">
              <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                <label>Payment Account</label>
                <input className="form-control" type="text" />
              </div>
              <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                <label>Payment Routing</label>
                <input className="form-control" type="text" />
              </div>
            </div>

            <div className="text-right mt-3" style={{ float: "right" }}>
              <button className="btn btn-default">Save Changes</button>
            </div>
          </div>
        </Collapse>
      </div>
    </div>
  );
}
export default PaymentInformation;
