import ReactFlagsSelect from "react-flags-select";
function SellStep1(props) {
  return (
    <>
      <div className="form mt-5">
        <div className="mt-3">
          <label>Business Location</label>
          <ReactFlagsSelect />
        </div>
        <div className="mt-3">
          <label>Business Type</label>
          <select className="form-control"></select>
        </div>
        <div className="mt-2">
          <p>
            By clicking on " Agree and continue" , you agree to accept the
            following policies, agreements and notices.
          </p>
        </div>
      </div>
    </>
  );
}
export default SellStep1;