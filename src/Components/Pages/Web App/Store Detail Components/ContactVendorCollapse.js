import { useState } from "react";
import { Collapse } from "reactstrap";

function ContactVendorCollapse({ Business }) {
  const [Open, setOpen] = useState(false);
  return (
    <>
      <div
        className="d-flex justify-content-between mt-3"
        //   onClick={() => setIsOpen(!isOpen)}
        style={{
          cursor: "pointer",
          borderBottom: "1px solid #C7C7C7",
        }}
      >
        <h6 className="ftw-400">Contact Vendor</h6>
        <div>
          {Open ? (
            <i
              className="fas fa-minus  text-secondary"
              onClick={() => setOpen(!Open)}
            ></i>
          ) : (
            <i
              className="fas fa-plus text-secondary"
              onClick={() => setOpen(!Open)}
            ></i>
          )}
        </div>
      </div>
      <Collapse isOpen={Open}>
        <div className="row mt-2">
          <div className="col-6">
            <h6 className="text-secondary">Email</h6>
          </div>
          <div className="col-6" style={{ wordWrap: "break-word" }}>
            {Business && Business.BusinessEmail}
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-6">
            <h6 className="text-secondary">Contact</h6>
          </div>
          <div className="col-6">{Business && Business.BusinessPhone}</div>
        </div>
      </Collapse>
    </>
  );
}
export default ContactVendorCollapse;
