import { useState } from "react";
import { useHistory } from "react-router-dom";
function OtherSettings() {
  const history = useHistory();
  const [activeItem, setActiveItem] = useState("1");
  return (
    <div className="card mt-5">
      <div className="card-body">
        <h4 className="ftw-400 text-default">Settings</h4>

        <div className="row">
          <div className="col-3">
            <ul style={{ listStyle: "none" }} className="setting-ul">
              <li
                className={activeItem === "1" ? "active" : ""}
                onClick={() => setActiveItem("1")}
              >
                Manage Countries
              </li>
              <li
                className={activeItem === "2" ? "active" : ""}
                onClick={() => setActiveItem("2")}
              >
                Payment Gateway
              </li>
              <li
                className={activeItem === "3" ? "active" : ""}
                onClick={() => setActiveItem("3")}
              >
                Courier Services
              </li>
            </ul>
          </div>
          <div className="col-8 sidebox-right">
            <section>
              <div className="sidebox-header">Countries, States & Cities</div>
              <div className="pt-2">
                <p>Manage countries, states and cities for website. </p>
                <div className="row m-0">
                  <div className="col-4">
                    <div style={{ float: "right" }}>
                      <button
                        className="btn btn-success btn-md"
                        onClick={() => history.push("/panel/country-list")}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="mt-3">
              <div className="sidebox-header">Payement Gateway</div>
              <div className="pt-2">
                <p>Add new payment gateway, update previous or remove </p>
                <div className="row m-0">
                  <div className="col-4">
                    <div style={{ float: "right" }}>
                      <button
                        className="btn btn-success btn-md"
                        onClick={() => history.push("/panel/payment-gateway")}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="mt-3">
              <div className="sidebox-header">Courier Services</div>
              <div className="pt-2">
                <p>Add new courier services, update previous or remove </p>
                <div className="row m-0">
                  <div className="col-4">
                    <div style={{ float: "right" }}>
                      <button
                        className="btn btn-success btn-md"
                        onClick={() => history.push("/panel/courier-services")}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
export default OtherSettings;
