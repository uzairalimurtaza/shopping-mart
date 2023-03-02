import { Collapse } from "reactstrap";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";

function BusinessInformation() {
  const [Open, SetOpen] = useState(true);
  return (
    <div>
      <div className="card cstore-card">
        <div className="card-header d-flex justify-content-between cstore-cardheader mt-2 mb-2">
          <h6 className="ftw-400">Business Information</h6>
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
                <label>Business Email</label>
                <input className="form-control" type="email" />
              </div>
              <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                <label>Business Phone</label>
                <PhoneInput
                  value={""}
                  country={"bd"}
                  inputClass="adduser-phone"
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                <label>Business URL</label>
                <input className="form-control" type="text" />
              </div>
              <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                <label>Gateway ID</label>
                <input className="form-control" type="text" />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                <label>Allow Delivery</label>
                <div className="d-flex" style={{ alignItems: "end" }}>
                  <div className="cs-bi-radios">
                    <label>
                      <input
                        type="radio"
                        className="cs-bi-radios-input"
                        name="allowDelivery"
                      />{" "}
                      Yes
                    </label>
                  </div>
                  <div className="cs-bi-radios">
                    <label>
                      <input
                        type="radio"
                        className="cs-bi-radios-input"
                        name="allowDelivery"
                      />{" "}
                      No
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                <label>Allow Store Pickup</label>
                <div className="d-flex" style={{ alignItems: "end" }}>
                  <div className="cs-bi-radios">
                    <label>
                      <input
                        type="radio"
                        className="cs-bi-radios-input"
                        name="allowDelivery"
                      />{" "}
                      Yes
                    </label>
                  </div>
                  <div className="cs-bi-radios">
                    <label>
                      <input
                        type="radio"
                        className="cs-bi-radios-input"
                        name="allowDelivery"
                      />{" "}
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                <label>Product Approval</label>
                <div className="d-flex" style={{ alignItems: "end" }}>
                  <div className="cs-bi-radios">
                    <label>
                      <input
                        type="radio"
                        className="cs-bi-radios-input"
                        name="allowDelivery"
                      />{" "}
                      Yes
                    </label>
                  </div>
                  <div className="cs-bi-radios">
                    <label>
                      <input
                        type="radio"
                        className="cs-bi-radios-input"
                        name="allowDelivery"
                      />{" "}
                      No
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                <label>Created Date</label>
                <input className="form-control cs-date-input" type="date" />
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12">
                <label>Admin Note</label>
                <textarea className="form-control" rows={"5"} />
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
export default BusinessInformation;
