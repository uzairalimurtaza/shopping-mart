function EditProductFormVariations() {
  return (
    <>
      <div>
        <b style={{ fontWeight: "600", fontSize: "15px" }}>
          Select the availabe variants from the list{" "}
        </b>
      </div>
      <div className="row">
        <div className="col-6">
          <select
            value={OptionId}
            className="form-control"
            onChange={(e) => {
              getOptionValues(e.target.value);
              setOptionid(e.target.value);
            }}
          >
            <option value={"null"}>Select Options</option>
            {Variations.map((item, index) => (
              <option
                value={item.value}
                key={index}
                selected={OptionId === item.value}
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col-6">
          <div style={{ float: "right" }}>
            <button className="btn btn-success" onClick={() => AddNewOption()}>
              Add More
            </button>
          </div>
        </div>
      </div>
      {VariationValues.map((item, index) => (
        <div
          className="row p-3 m-3"
          style={{ border: "1px solid rgba(128, 128, 128, 0.58) " }}
          key={index}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="ftw-400 text-default">
              {item.VariantName} - {item.VariantValue}
            </h5>
            {!item.isNew && VariationValues.length > 1 && (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => removeVariantValue(item.OptionValueID)}
              >
                <i className="fas fa-times text-danger"></i>
              </div>
            )}
          </div>

          <div className="col-6">
            <label>Value</label>
            <input
              className="form-control"
              type="text"
              name="VariantValue"
              onChange={(e) => handleVariationValueChange(e, index)}
              value={item.VariantValue}
            />
          </div>
          <div className="col-6">
            <label>SKU</label>
            <input
              className="form-control"
              type="text"
              value={item.SKU}
              name="SKU"
              onChange={(e) => handleVariationValueChange(e, index)}
            />
          </div>
          <div className="col-6">
            <label>Price</label>
            <input
              className="form-control"
              type="number"
              value={item.Price}
              onChange={(e) => handleVariationValueChange(e, index)}
              name="Price"
            />
          </div>
          <div className="col-6">
            <label>Inventory</label>
            <input
              className="form-control"
              type="number"
              value={item.Inventory}
              onChange={(e) => handleVariationValueChange(e, index)}
              name="Inventory"
            />
          </div>
          <div className="col-6">
            <label>Available Inventory</label>
            <input
              className="form-control"
              type="number"
              onChange={(e) => handleVariationValueChange(e, index)}
              name="AvailableInventory"
              value={item.AvailableInventory}
            />
          </div>
          <div className="col-6">
            <label>Total Price</label>
            <input
              className="form-control"
              type="number"
              onChange={(e) => handleVariationValueChange(e, index)}
              name="TotalPrice"
              value={item.TotalPrice}
            />
          </div>
          <div className="col-6">
            <label>Unit Price</label>
            <input
              className="form-control"
              type="number"
              onChange={(e) => handleVariationValueChange(e, index)}
              name="UnitPrice"
              value={item.UnitPrice}
            />
          </div>

          <div className="col-6">
            <label>Image </label>
            <input
              className="form-control"
              type="file"
              onChange={(e) =>
                handleUpdateVarantValueImage(e.target.files[0], index)
              }
            />
          </div>
          <div className="col-6">
            <>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input default-check-color"
                  type="checkbox"
                  id="inlineCheckbox3"
                  defaultChecked={item.MainImage === "Y"}
                  onChange={() =>
                    handleVariationValueMainImageChange(
                      item.MainImage === "Y" ? "N" : "Y",
                      index
                    )
                  }
                />
                <label className="form-check-label" for="inlineCheckbox3">
                  Main Image
                </label>
              </div>
            </>
          </div>
          <div className="w-100">
            {item.isNew ? (
              <div style={{ float: "right" }}>
                <button
                  className="btn btn-success"
                  onClick={() => AddNewOptionValue(item)}
                >
                  Add Value{" "}
                </button>
              </div>
            ) : (
              <div style={{ float: "right" }}>
                <button
                  className="btn btn-success"
                  onClick={(e) =>
                    submitOptionValueDetail(item.OptionValueID, item)
                  }
                >
                  Save{" "}
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
export default EditProductFormVariations;
