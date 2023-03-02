import moment from "moment";
import Pdf from "react-to-pdf";
import BanglaLogo from "./../../../../../../assets/images/favicon.png";
import { useRef } from "react";
function AdminOrderInvoiceDetails({ OrderDeliveryDetails, OrderDetails }) {
  const ref = useRef(null);

  let getSingleTotal = (status, item) => {
    let product = item;
    let array = item["ProductCombinations"];
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
      return parseFloat(item.Quantity) * totalSingle;
    } else {
      return variantValues.join(",");
    }
  };
  let getOverAllTotal = () => {
    var totalCount = 0;
    let indexes = OrderDetails["ProductDetail"];
    for (let i = 0; i < indexes.length; i++) {
      let currentProduct = indexes[i];
      let currentCombination = currentProduct["ProductCombinations"];
      totalCount += parseFloat(currentProduct.BasePrice);
      for (let j = 0; j < currentCombination.length; j++) {
        totalCount += parseFloat(currentCombination[j].ProductCombinationPrice);
      }
      totalCount = totalCount * parseInt(currentProduct.Quantity);
    }
    return totalCount;
  };

  return (
    <div className="container">
      <div className="text-right">
        <Pdf targetRef={ref} filename={`${OrderDetails.OrderNumber}.pdf`}>
          {({ toPdf }) => (
            <button className="btn btn-md btn-success" onClick={toPdf}>
              Generate PDF
            </button>
          )}
        </Pdf>
      </div>
      {OrderDeliveryDetails && (
        <div className="col-9 m-auto">
          <div className="invoice" ref={ref}>
            <div className="invoice-company text-inverse d-flex justify-content-between">
              <div>
                <img src={BanglaLogo} style={{ height: "25px" }} /> BanglaBazar{" "}
              </div>
              {/* <div>
                <span className="pull-right hidden-print">
                  <a
                    href="javascript:;"
                    className="btn btn-sm btn-white m-b-10 p-l-5"
                  >
                    <i className="fa fa-file t-plus-1 text-danger fa-fw fa-lg"></i>{" "}
                    Export as PDF
                  </a>
                  <a
                    href="javascript:;"
                    onclick="window.print()"
                    className="btn btn-sm btn-white m-b-10 p-l-5"
                  >
                    <i className="fa fa-print t-plus-1 fa-fw fa-lg"></i> Print
                  </a>
                </span>
              </div> */}
            </div>
            <div className="invoice-header">
              <div className="invoice-from">
                {/* <small>from</small> */}
                <address className="m-t-5 m-b-5">
                  <strong className="text-inverse">from</strong>
                  <br></br>
                  <b className="text-default" style={{ fontSize: "15px" }}>
                    BanglaBazar
                  </b>
                </address>
              </div>
              <div className="invoice-to">
                {/* <small>to</small> */}
                <address className="m-t-5 m-b-5">
                  <strong className="text-inverse">to</strong>
                  <br />
                  {OrderDeliveryDetails.DeliveryAddress1}
                  <br />
                  {OrderDeliveryDetails.DeliveryCity},{" "}
                  {OrderDeliveryDetails.DeliveryZipCode}
                  <br />
                  Phone: {OrderDeliveryDetails.DeliveryPhoneNumber}
                </address>
              </div>
              <div className="invoice-date">
                <small>Invoice</small>
                <div className="date text-inverse m-t-5">
                  {moment(OrderDeliveryDetails.DesireDate).format("DD-MM-YYYY")}
                </div>
                <div className="invoice-detail">
                  Order#: {OrderDeliveryDetails.OrderNumber}
                  <br />
                  TranId#: {OrderDetails.TransactionID}
                </div>
              </div>
            </div>
            <div className="invoice-content">
              <div className="table-responsive">
                <table className="table table-invoice">
                  <thead>
                    <tr>
                      <th className="text-center">PRODUCT</th>
                      <th className="text-center">VARIATIONS</th>
                      <th className="text-center">PRICE</th>
                      <th className="text-center">QUANTITY</th>
                      <th className="text-center">SUBTOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {OrderDetails["ProductDetail"].map((item, index) => (
                      <tr key={index} className="text-center">
                        <td>
                          <div>{item.Title}</div>
                        </td>
                        <td>{getSingleTotal(2, item)}</td>
                        <td>{`${item.Currency} ${getSingleTotal(0, item)}`}</td>
                        <td>
                          {" "}
                          <div className="product-quantity">
                            {item.Quantity}
                          </div>
                        </td>
                        <td>{`${item.Currency} ${getSingleTotal(1, item)}`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="invoice-price">
                <div className="invoice-price-left">
                  <div className="invoice-price-row">
                    <div className="sub-price">
                      <small>SUBTOTAL</small>
                      <span className="text-inverse">
                        {OrderDetails.ProductDetail[0].Currency}{" "}
                        {getOverAllTotal().toFixed(2)}
                      </span>
                    </div>
                    {/* <div className="sub-price">
                      <i className="fa fa-plus text-muted"></i>
                    </div> */}
                    {/* <div className="sub-price">
                      <small>Shipment Fee (15%)</small>
                      <span className="text-inverse">
                        {" "}
                        {OrderDetails.ProductDetail[0].Currency}{" "}
                        {getOverAllTotal().toFixed(2)}
                      </span>
                    </div> */}
                  </div>
                </div>
                <div className="invoice-price-right">
                  <small>TOTAL</small>{" "}
                  <span className="f-w-600">
                    {" "}
                    {OrderDetails.ProductDetail[0].Currency}{" "}
                    {getOverAllTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div className="invoice-note">
              * Make all cheques payable to BanglaBazar
              <br />
              * Payment is due within 30 days
              <br />* If you have any questions concerning this invoice, contact
              [John Doe, 088634834683638, johndoe@gmail.com]
            </div>

            <div className="invoice-footer">
              <p className="text-center m-b-5 f-w-600">
                THANK YOU FOR YOUR BUSINESS
              </p>
              <p className="text-center">
                <span className="m-r-10">
                  <i className="fa fa-fw fa-lg fa-globe text-default"></i>{" "}
                  banglabazar.com
                </span>
                <span className="m-r-10">
                  <i className="fa fa-fw fa-lg fa-phone-volume text-default"></i>{" "}
                  T:016-18192302
                </span>
                <span className="m-r-10">
                  <i className="fa fa-fw fa-lg fa-envelope text-default"></i>{" "}
                  admin@gmail.com
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminOrderInvoiceDetails;
