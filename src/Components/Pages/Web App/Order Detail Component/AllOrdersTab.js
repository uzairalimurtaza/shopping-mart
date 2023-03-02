import { Row, Col } from "reactstrap";
import OrderProductOrder from "./OrderProductCard";

function AllOrderTab({ Orders }) {
  return (
    <>
      {Orders.length === 1 ? (
        <Row>
          <Col lg="6">
            <OrderProductOrder order={Orders[0]} />
          </Col>
        </Row>
      ) : (
        <Row>
          {Orders.map((order, index) => (
            <Col lg="6" key={index} className="mt-2">
              <OrderProductOrder order={order} filter="all" />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
}
export default AllOrderTab;
