import RatingStars from "./../../../../Helpers/RatingStars";
import Endpoint from "./../../../../Utils/Endpoint";

function ODByONProductItem({ product }) {
  let getSingleTotal = (status) => {
    let array = product.ProductCombinations;
    let basePrice = parseFloat(product.BasePrice);
    let variantValues = [];
    var variationsSum = 0;
    for (let i = 0; i < array.length; i++) {
      variationsSum += parseFloat(array[i].ProductCombinationPrice);
      variantValues.push(array[i].OptionValue);
    }
    const totalSingle = basePrice + variationsSum;

    if (status === 0) {
      return totalSingle;
    } else if (status === 1) {
      return parseFloat(product.Quantity) * totalSingle;
    } else {
      return variantValues.join(",");
    }
  };
  return (
    <div className="d-flex align-items-center">
      <div style={{ width: "10%", position: "relative" }}>
        {" "}
        <img
          src={`${Endpoint}/${product.Medium}`}
          className="img-fluid w-100 h-100"
        />
      </div>
      <div style={{ marginLeft: "15px" }}>
        <div>
          <h5 className="mb-0">{product.Title}</h5>
          <div className="mt-1 mb-1">
            <span className="text-secondary">Quantity :</span>{" "}
            {product.Quantity}
          </div>
          <div className="text-orange">
            Price : {`${product.Currency} ${getSingleTotal(1)}`}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ODByONProductItem;
