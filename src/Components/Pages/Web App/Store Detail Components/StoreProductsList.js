import NoProduct from "../../../../assets/images/no-product.png";
import { Link, useHistory } from "react-router-dom";
import { Row, Col } from "reactstrap";
import { STORE_DETAIL_CONTEXT } from "./../../../Contexts/StoreDetailContext";
import { useContext } from "react";
import Endpoint from "./../../../../Utils/Endpoint";
import AddProductClick from "../../../../Helpers/AddProductClick";
import { useSelector } from "react-redux";
import ProductImage from "./../../../../Utils/ProductImage";
function StoreProductList() {
  var history = useHistory();
  const state = useSelector((state) => state);
  const { currentIPv4 } = state;
  var { Products } = useContext(STORE_DETAIL_CONTEXT);
  return (
    <Row>
      <Col sm="12">
        <div className="mt-4">
          {Products.length > 0 ? (
            <div className="row">
              {Products.map((item, index) => (
                <div
                  className="col-xl-3 col-lg-3 col-md-6 col-sm-12"
                  key={index}
                >
                  <ProductImage item={item} type="general" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="text-center">
                <img src={NoProduct} className="img-fluid" />
                <h4 className="mt-3 text-default">No Product Found</h4>
              </div>
            </>
          )}
        </div>
      </Col>
    </Row>
  );
}
export default StoreProductList;
