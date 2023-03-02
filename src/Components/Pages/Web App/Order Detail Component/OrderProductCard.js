import { Link } from "react-router-dom";
import moment from "moment";
import { useState } from "react";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  CardHeader,
  Collapse,
  CardFooter,
} from "reactstrap";
import RatingStars from "../../../../Helpers/RatingStars";
import Endpoint from "../../../../Utils/Endpoint";
function OrderProductOrder({ order }) {
  const [IsCollpase, setIsCollpased] = useState(false);
  let GetPriceOrVariation = (indexedOrder, status) => {
    let currentOrder = indexedOrder;
    let basePrice = parseFloat(currentOrder.BasePrice);
    let combinationPrice = 0.0;
    let variations = [];
    let combinations = currentOrder.ProductCombinations;
    for (let i = 0; i < combinations.length; i++) {
      combinationPrice += parseFloat(combinations[i].ProductCombinationPrice);
      variations.push(combinations[i].OptionValue);
    }
    let sum = combinationPrice + basePrice;
    let variationString = variations.join(" , ");
    if (status === 0) {
      return sum;
    } else {
      return variationString;
    }
  };
  var orderTotalAmount = () => {
    var currentOrder = order.ProductDetail;
    var totalAmount = 0;
    for (let i = 0; i < currentOrder.length; i++) {
      totalAmount =
        totalAmount +
        parseFloat(currentOrder[i].BasePrice) +
        parseFloat(currentOrder[i].ItemsEstimatedTax) +
        parseFloat(currentOrder[i].ItemsShippingHandling);

      var combinations = currentOrder[i].ProductCombinations;
      var combinationPrices = 0;
      for (let j = 0; j < combinations.length; j++) {
        combinationPrices =
          combinationPrices +
          parseFloat(combinations[j]["ProductCombinationPrice"]);
      }
      totalAmount = totalAmount + combinationPrices;
    }

    return totalAmount;
  };
  let getDateDifference = (orderDate) => {
    var now = moment(new Date());
    var end = moment(orderDate).format("YYYY-MM-DD");
    var duration = moment.duration(now.diff(end));
    var days = duration.asDays();

    return days >= 14 ? false : true;
    // return true;
  };
  return (
    <Card>
      <CardHeader className="bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div style={{ fontSize: "15px" }}>
              Order:{" "}
              <Link
                to={`/order-details/${order.OrderNumber}`}
                className="td-none"
              >
                {order.OrderNumber}
              </Link>{" "}
            </div>
            <div>
              <span className="text-secondary">
                Placed Date: {moment(order.OrderDate).format("DD-MM-YYYY")}
              </span>
            </div>
          </div>
          <div>
            {order.PaymentStatus.toLowerCase() === "failed" && (
              <Link
                className="td-none text-orange"
                to="#"
                style={{ fontSize: "15px" }}
              >
                Payment Failed
              </Link>
            )}
            {order.PaymentStatus.toLowerCase() === "cancel" && (
              <Link
                className="td-none text-orange"
                to="#"
                style={{ fontSize: "15px" }}
              >
                Payment Cancelled
              </Link>
            )}
            {order.PaymentStatus.toLowerCase() === "paid" && (
              <Link
                className="td-none text-orange"
                to="#"
                style={{ fontSize: "15px" }}
              >
                Paid
              </Link>
            )}
            {order.PaymentStatus.toLowerCase() === "pending" && (
              <Link
                className="td-none text-orange"
                to="#"
                style={{ fontSize: "15px" }}
              >
                Pending
              </Link>
            )}
            {order.PaymentStatus.toLowerCase() === "unpaid" && (
              <Link
                className="td-none text-danger"
                to="#"
                style={{ fontSize: "15px" }}
              >
                Unpaid
              </Link>
            )}
          </div>
          <div>
            <Link
              className="td-none text-dark"
              to="#"
              style={{ fontSize: "15px" }}
              onClick={() => setIsCollpased(!IsCollpase)}
            >
              {IsCollpase ? (
                <span>
                  Hide Details <i className="fas fa-chevron-up"></i>
                </span>
              ) : (
                <span>
                  Show Details <i className="fas fa-chevron-down"></i>
                </span>
              )}
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardBody className={IsCollpase ? "" : "p-0"}>
        <Collapse isOpen={IsCollpase}>
          {order && (order.DeliveryStatus === "usps_intl" || order.DeliveryDate === "dhl") && (
            <div>
              {" "}
              <span className="text-orange">
                Global orders cannot be refunded
              </span>
            </div>
          )}
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <span>
                Transaction ID :{" "}
                <Link to="#" className="text-orange">
                  {order.TransactionID}
                </Link>
              </span>
            </div>
            {order &&
              order.DeliveryDate && order.DeliveryStatus != "usps_intl" && order.DeliveryDate != "dhl" &&
              getDateDifference(order.DeliveryDate) && (
                <div>
                  {" "}
                  <span>
                    <Link
                      to={`/request-refund/${order.OrderNumber}`}
                      className="text-dark"
                    >
                      Request Refund
                    </Link>
                  </span>
                </div>
              )}
          </div>
          {order.ProductDetail.map((item, index) => (
            <div className="row mt-2" key={index}>
              <div className="col-2 ">
                <img
                  className="w-100"
                  style={{ maxWidth: "fit-content", height: "75px" }}
                  src={`${Endpoint}/${item.Small}`}
                />
              </div>
              <div className="col-6 m-auto">
                <div>
                  <div>
                    <h5 className="mb-0">{item.Title}</h5>
                  </div>
                  <div className="pt-1 pb-1">
                    <p className="mb-0" style={{ fontWeight: "600" }}>
                      Variations: {GetPriceOrVariation(item, 1)}
                    </p>
                  </div>
                  <div className="text-orange" style={{ fontSize: "13px" }}>
                    Price: {item.Currency} {GetPriceOrVariation(item, 0)}
                  </div>
                </div>
              </div>
              <div className="col-4 m-auto">
                <span className="dotd-rate">
                  {RatingStars(item.AVG_Rating ? parseInt(item.AVG_Rating) : 0)}{" "}
                  ({item.REVIEW_COUNT})
                </span>
              </div>
            </div>
          ))}
        </Collapse>
      </CardBody>
      <CardFooter>
        <div style={{ textAlign: "right" }}>
          Total Paid :{" "}
          <span>
            <b className="text-default">
              {order.ProductDetail[0].Currency} {order && orderTotalAmount().toFixed(2)}
            </b>
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
export default OrderProductOrder;
