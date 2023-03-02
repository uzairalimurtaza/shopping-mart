import { Spinner } from "reactstrap";

function Loading(props) {
  return (
    <div className="text-center" style={{ marginTop: "25px", height: "100px" }}>
      <Spinner className="text-default" />{" "}
      {props.text ? props.text : "Getting Data..."}
    </div>
  );
}
export default Loading;
