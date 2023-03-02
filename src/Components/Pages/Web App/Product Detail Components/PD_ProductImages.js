import Endpoint from "./../../../../Utils/Endpoint";

function Product_Detail_ProductImages(props) {
  return (
    <>
      <div className="product-img text-center">
        <img
          src={`${Endpoint}/${props.MainImage && props.MainImage}`}
          className="img-fluid"
          alt="Product-Main-Image"
          style={{ height: "46vh" }}
        />
      </div>
      {/* <div className="row mt-4">
        <div className="col-3">
          <img
            src="https://cdn.shopify.com/s/files/1/0371/5416/0772/products/1_9d91868d-d2bd-449e-8d95-e9b2c01277dd.jpg?v=1628587617"
            className="img-fluid"
            style={{ maxHeight: "10vh" }}
          />
        </div>
        <div className="col-3">
          <img
            src="https://cdn.shopify.com/s/files/1/0371/5416/0772/products/1_9d91868d-d2bd-449e-8d95-e9b2c01277dd.jpg?v=1628587617"
            className="img-fluid"
            style={{ maxHeight: "10vh" }}
          />
        </div>

        <div className="col-3">
          <img
            src="https://cdn.shopify.com/s/files/1/0371/5416/0772/products/1_9d91868d-d2bd-449e-8d95-e9b2c01277dd.jpg?v=1628587617"
            className="img-fluid"
            style={{ maxHeight: "10vh" }}
          />
        </div>
        <div className="col-3">
          <img
            src="https://cdn.shopify.com/s/files/1/0371/5416/0772/products/1_9d91868d-d2bd-449e-8d95-e9b2c01277dd.jpg?v=1628587617"
            className="img-fluid"
            style={{ maxHeight: "10vh" }}
          />
        </div>
      </div> */}
    </>
  );
}
export default Product_Detail_ProductImages;
