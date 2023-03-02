import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Collapse } from "reactstrap";
import Endpoint from "../../../../Utils/Endpoint";
function SDTopRatedProducts() {
  const [Open, setOpen] = useState(false);
  const { landingPage } = useSelector((state) => state);
  const [TopRatedProducts, setTopRatedProducts] = useState([]);
  useEffect(() => {
    if (landingPage.loading === false) {
      setTopRatedProducts(landingPage.data.topRatedProducts);
    }
  }, [landingPage.data]);
  return (
    <>
      <div
        className="d-flex justify-content-between mt-3"
        //   onClick={() => setIsOpen(!isOpen)}
        style={{
          cursor: "pointer",
          borderBottom: "1px solid #C7C7C7",
        }}
      >
        <h6 className="ftw-400">Top Rated Products</h6>
        <div>
          {Open ? (
            <i
              className="fas fa-minus  text-secondary"
              onClick={() => setOpen(!Open)}
            ></i>
          ) : (
            <i
              className="fas fa-plus text-secondary"
              onClick={() => setOpen(!Open)}
            ></i>
          )}
        </div>
      </div>
      <Collapse isOpen={Open}>
        {TopRatedProducts.slice(0, 5).map((product, index) => (
          <div key={index}>
            <div className="row mt-2 align-items-baseline">
              <div className="col-4 ">
                <img
                  className="w-100"
                  src={`${Endpoint}/${product.Small}`}
                  style={{ maxWidth: "fit-content", height: "75px" }}
                />
              </div>
              <div className="col-4 ">
                <div>
                  <div>
                    <h5 className="mb-0">
                      <Link to={`/product-details/${product.ProductID}`}>
                        {product.Title}
                      </Link>
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <span className="dotd-rate">
                  {/* {RatingStars(
                    product.AVG_RATING ? parseFloat(product.AVG_RATING) : 0
                  )} */}
                  <strong>
                    Rating :{" "}
                    <span className="text-orange">
                      {product.AVG_RATING ? parseFloat(product.AVG_RATING) : 0}
                    </span>
                  </strong>
                </span>
              </div>
            </div>
          </div>
        ))}
      </Collapse>
    </>
  );
}
export default SDTopRatedProducts;
