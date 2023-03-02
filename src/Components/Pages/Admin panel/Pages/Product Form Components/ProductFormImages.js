import { useContext } from "react";
import { PRODUCT_FORM_CONTEXT } from "./../../../../Contexts/ProductFormContext";
function ProductFormImages() {
  const { setSmall, setMedium, setLarge, MainImage, setMainImage } =
    useContext(PRODUCT_FORM_CONTEXT);
  return (
    <div>
      <div>
        <h5 className="ftw-400">Small</h5>
        <div>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => setSmall(e.target.files[0])}
          />
        </div>
      </div>
      <div>
        <h5 className="ftw-400">Medium</h5>
        <div>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => setMedium(e.target.files[0])}
          />
        </div>
      </div>
      <div>
        <h5 className="ftw-400">Large</h5>
        <div>
          <div>
            <input
              className="form-control"
              type="file"
              accept="image/*"
              onChange={(e) => setLarge(e.target.files[0])}
            />
          </div>
        </div>
      </div>
      <div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input default-check-color"
            type="checkbox"
            id="inlineCheckbox3"
            defaultChecked={MainImage === "Y"}
            onChange={() => setMainImage(MainImage === "Y" ? "N" : "Y")}
          />
          <label className="form-check-label" for="inlineCheckbox3">
            Main Image
          </label>
        </div>
      </div>
    </div>
  );
}
export default ProductFormImages;
