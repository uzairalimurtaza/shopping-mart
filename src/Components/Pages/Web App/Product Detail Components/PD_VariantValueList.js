import Endpoint from "./../../../../Utils/Endpoint";
import { useState, useEffect } from "react";
function ProductDetail_VariantValues({
  item,
  SelectedValues,
  setSelectedValues,
  variantIndex,
  setCurrentlyActive,
  setCounter,
}) {
  const [activeVariantValue, setActiveVariantValue] = useState(`VVI0`);

  useEffect(() => {
    if (item) {
      if (variantIndex === 0) setCurrentlyActive(item.Values[0]);
      var obj = SelectedValues;
      obj[variantIndex] = item.Values[0];
      setSelectedValues(obj);
    }
  }, []);

  const variantValue = (varaintValue, index) => {
    return (
      <div
        key={index}
        className="col-2 text-center valueVariantImage"
        onClick={async () => {
          setActiveVariantValue(`VVI${index}`);
          setCurrentlyActive(varaintValue);
          setCounter(varaintValue.AvailableInventory > 0 ? 1 : 0);
          var obj = SelectedValues;
          obj[variantIndex] = varaintValue;
          console.log(obj);
          await setSelectedValues(obj);
        }}
      >
        <div
          className={
            activeVariantValue === `VVI${index}` ? "active-variant-value" : ""
          }
          id={`VVI${index}`}
          style={{ width: "40px" }}
        >
          <img
            src={`${Endpoint}/${varaintValue.Small}`}
            className="img-fluid "
            style={{
              height: "40px",
              width: "40px",
            }}
          />
        </div>
        <div className="text-center m-auto">{varaintValue.VariantValue}</div>
      </div>
    );
  };
  return (
    <div className="row mt-3">
      {item.Values.map((varaintValue, index) =>
        variantValue(varaintValue, index)
      )}
    </div>
  );
}
export default ProductDetail_VariantValues;
