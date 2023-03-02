import { Link } from "react-router-dom";
import Icons from "./../../../../Utils/Icons";
import firetoast from "./../../../../Helpers/FireToast";
import Endpoint from "./../../../../Utils/Endpoint";
import axios from "axios";
import { useState } from "react";

function VariantValueRow(props) {
  const [variantValue, setVariantValue] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [toBeEdited, setToBeEdited] = useState({});
  var createNewVariant = async () => {
    try {
      var form = new URLSearchParams();
      form.append("SubCategoryVariantID", props.variant.SubCategoryVariantID);
      form.append("VariantValue", variantValue);
      var response = await axios.post(
        `${Endpoint}/api/category/insert-subcategoryvariantvalue`,
        form
      );
      if (response.data.status) {
        props.clearNewVariant();
        props.getVariantValues(props.variant.SubCategoryVariantID);
        firetoast("Variant Added !", "success", 3000, "top-right");
      } else {
        firetoast(
          response.data.error || response.data.message,
          "error",
          3000,
          "top-right"
        );
      }
    } catch (e) {
      firetoast("Error while adding new variant", "error", 3000, "top-right");
    }
  };
  var deleteVariant = async (id) => {
    try {
      var response = await axios.delete(
        `${Endpoint}/api/category/delete-subcategoryvariantvalue/${id}`
      );
      if (response.data.status) {
        firetoast("Removed Successfully", "success", 3000, "top-right");
        props.getVariantValues(props.variant.SubCategoryVariantID);
      } else {
        firetoast(
          response.data.error || response.data.message,
          "error",
          3000,
          "top-right"
        );
      }
    } catch (e) {
      console.log(e);
      firetoast("Error on removing variant", "error", 3000, "top-right");
    }
  };
  var updateVariant = async () => {
    try {
      var form = new URLSearchParams();
      form.append("SubCategoryVariantID", toBeEdited.SubCategoryVariantID);
      form.append("VariantValue", variantValue);
      const response = await axios.put(
        `${Endpoint}/api/category/update-subcategoryvariantvalue/${toBeEdited.SubCategoryVariantValueID}`,
        form
      );
      if (response.data.status) {
        firetoast("Variant Value Updated", "success", 3000, "top-right");
        props.getVariantValues(toBeEdited.SubCategoryVariantID);
        setIsUpdate(false);
      }
    } catch (e) {
      firetoast("Error while updating varient", "error", 3000, "top-center");
    }
  };
  return (
    <>
      {props.status === "1" &&
        (!isUpdate ? (
          <div className="w-100 mt-2" style={{ alignItems: "center" }}>
            <table
              className="table table-borderless"
              style={{ width: "100%", tableLayout: "fixed" }}
            >
              <tbody>
                <tr className="text-center">
                  <td>
                    <h6 className="ftw-400">{props.variant.VariantValue}</h6>
                  </td>
                  <td>
                    {" "}
                    <Link
                      to="#"
                      onClick={() => {
                        setToBeEdited(props.variant);
                        setIsUpdate(true);
                      }}
                    >
                      <span>
                        <i className="fas fa-edit text-primary"></i>
                      </span>
                    </Link>
                  </td>
                  <td>
                    {" "}
                    <Link
                      to="#"
                      onClick={() => {
                        deleteVariant(props.variant.SubCategoryVariantValueID);
                      }}
                    >
                      <i className="fas fa-trash text-danger"></i>
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <table
            className="table table-borderless"
            style={{ width: "100%", tableLayout: "fixed" }}
          >
            <thead></thead>
            <tbody>
              <tr className="text-center">
                <td>
                  <input
                    className="form-control"
                    onChange={(e) => setVariantValue(e.target.value)}
                    defaultValue={toBeEdited.VariantValue}
                  />
                </td>
                <td>
                  {" "}
                  <Link
                    to="#"
                    onClick={() => {
                      updateVariant();
                    }}
                  >
                    {Icons.GreenTick}
                  </Link>
                </td>
                <td>
                  {" "}
                  <Link to="#" onClick={() => setIsUpdate(false)}>
                    {Icons.RedCross}
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        ))}
      {props.status === "2" && (
        <table
          className="table table-borderless"
          style={{ width: "100%", tableLayout: "fixed" }}
        >
          <thead></thead>
          <tbody>
            <tr className="text-center">
              <td>
                <input
                  className="form-control"
                  onChange={(e) => setVariantValue(e.target.value)}
                />
              </td>
              <td>
                {" "}
                <Link
                  to="#"
                  onClick={() => {
                    if (props.status === "2") {
                      createNewVariant();
                    }
                  }}
                >
                  {Icons.GreenTick}
                </Link>
              </td>
              <td>
                {" "}
                <Link
                  to="#"
                  onClick={() => {
                    if (props.status === "2") {
                      props.clearNewVariant();
                    }
                  }}
                >
                  {Icons.RedCross}
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
}
export default VariantValueRow;
