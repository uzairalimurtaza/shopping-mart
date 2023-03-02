import { Link } from "react-router-dom";
import Icons from "./../../../../Utils/Icons";
import firetoast from "./../../../../Helpers/FireToast";
import Endpoint from "./../../../../Utils/Endpoint";
import axios from "axios";
import { useState } from "react";

function VariantRow(props) {
  const [variantValue, setVariantValue] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [toBeEdited, setToBeEdited] = useState({});
  var createNewVariant = async () => {
    try {
      var form = new URLSearchParams();
      form.append("SubCategoryID", props.variant.SubCategoryID);
      form.append("Variant", variantValue);
      var response = await axios.post(
        `${Endpoint}/api/category/insert-subcategoryvariant`,
        form
      );
      if (response.data.status) {
        props.clearNewVariant();
        props.getVariants(props.variant.SubCategoryID);
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
        `${Endpoint}/api/category/delete-subcategoryvariant/${id}`
      );
      if (response.data.status) {
        firetoast("Removed Successfully", "success", 3000, "top-right");
        props.getVariants(props.variant.SubCategoryID);
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
      form.append("SubCategoryID", toBeEdited.SubCategoryID);
      form.append("Variant", variantValue);
      const response = await axios.put(
        `${Endpoint}/api/category/update-subcategoryvariant/${toBeEdited.SubCategoryVariantID}`,
        form
      );
      if (response.data.status) {
        firetoast("Variant Value Updated", "success", 3000, "top-right");
        props.getVariants(toBeEdited.SubCategoryID);
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
                    <h6 className="ftw-400">{props.variant.Variant}</h6>
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
                        deleteVariant(props.variant.SubCategoryVariantID);
                      }}
                    >
                      <i className="fas fa-trash text-danger"></i>
                    </Link>
                  </td>

                  <td>
                    {" "}
                    <Link
                      to="#"
                      className="text-success text-center td-none"
                      onClick={() =>
                        props.getVariantValues(
                          props.variant.SubCategoryVariantID
                        )
                      }
                    >
                      View Values
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
                    defaultValue={toBeEdited.Variant}
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
export default VariantRow;
