import Void from "../assets/images/void.svg";
export function NoData() {
  return (
    <>
      <img
        src={Void}
        className="mt-2"
        style={{ height: "120px", opacity: "0.9" }}
      />
      <h3 className="text-default mt-2">No Data to display</h3>
    </>
  );
}
