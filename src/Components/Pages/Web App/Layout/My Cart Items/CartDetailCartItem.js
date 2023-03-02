import Endpoint from "./../../../../../Utils/Endpoint";

function CartDetailCartItem({ product, combination }) {
  var getTotalPrice = () => {
    var priceArray = combination;
    console.log(priceArray);
    var totalPrice = 0;
    for (let i = 0; i < priceArray.length; i++) {
      totalPrice =
        totalPrice +
        parseFloat(priceArray[i]["ProductCombinationPrice"]);
    }
    console.log(totalPrice);
    totalPrice = (parseFloat(product.Price) + totalPrice) * parseFloat(product.Total_Quantity);

    return totalPrice;
  };
  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <div className="d-flex align-items-center">
            <div>
              <img
                className="img-fluid"
                src={`${Endpoint}/${combination[0].Small}`}
                style={{ height: "50px" }}
              />
            </div>

            <div style={{ marginLeft: "10px", marginTop: "10px" }}>
              <h6>{product.Title}</h6>
              <p className="mb-0">
                Quantity :{" "}
                <span className="text-dark">{product.Total_Quantity}</span>
              </p>
              <p className="mb-0">
                <small className="text-default">Delivery by {product.ShippingByAdmin === "Y" ? "BanglaBazar" : product.CompanyName}</small>
              </p>
            </div>
          </div>
        </div>
        <div>
          <h5>
            {product.Currency} {getTotalPrice().toFixed(2)}
          </h5>
        </div>
      </div>
    </div>
  );
}
export default CartDetailCartItem;
