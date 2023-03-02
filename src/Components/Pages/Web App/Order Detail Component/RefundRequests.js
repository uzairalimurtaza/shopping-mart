import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import firetoast from "../../../../Helpers/FireToast";
import { NoData } from "../../../../Helpers/NoData";
import RatingStars from "../../../../Helpers/RatingStars";
import Endpoint from "../../../../Utils/Endpoint";
import Loading from "../../../../Utils/Loading";
import BanglaBazarApi from "../../../Api/BanglaBazarApi";
export function RefundRequests() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [paginate, setPaginate] = useState({
    limit: "5",
    offset: 0,
    search: "",
    sort: "DESC",
  });
  useEffect(() => {
    getUserRefunds();
  }, [paginate]);
  var getUserRefunds = async () => {
    setLoading(true);
    try {
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/admin/getAll-ro`,
        paginate
      );
      if (response.data.status) {
        setRecords(response.data.orderDetails);
        setTotalRecords(parseInt(response.data.total_records));
      } else {
        let { error, message } = response.data;
        firetoast(error || message, "default-error");
      }
      setLoading(false);

      console.log(response);
    } catch (e) {
      setLoading(false);

      firetoast("Something went wrong", "default-error");
    }
  };
  var paginateData = (goTo) => {
    //console.log("called");
    var offset = paginate.offset + 1;
    var numOfPages = Math.ceil(totalRecords / offset);
    if (goTo === "next") {
      if (offset < numOfPages) {
        console.log(offset, numOfPages);
        paginate.offset = paginate.offset + 1;
        // //console.log(paginate)
        setPaginate(paginate);
      }
    } else if (goTo === "previous") {
      //console.log("previous");
      if (paginate.offset > 0) {
        paginate.offset = paginate.offset - 1;
        // //console.log(paginate)
        setPaginate(paginate);
      }
    }
  };
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
    var currentOrder = [];
    var totalAmount = 0;

    for (let i = 0; i < records.length; i++) {
      currentOrder.push(records[i]["ProductDetail"]);
    }
    // for (let i = 0; i < currentOrder.length; i++) {
    //   let current = currentOrder[i];
    //   console.log(current, i);
    //   totalAmount =
    //     totalAmount +
    //     parseFloat(current[i].BasePrice) +
    //     parseFloat(current[i].ItemsEstimatedTax) +
    //     parseFloat(current[i].ItemsShippingHandling);

    //   var combinations = current[i].ProductCombinations;
    //   var combinationPrices = 0;
    //   console.log(combinations);
    //   for (let j = 0; j < combinations.length; j++) {
    //     combinationPrices =
    //       combinationPrices +
    //       parseFloat(combinations[j]["ProductCombinationPrice"]);
    //   }
    //   totalAmount = totalAmount + combinationPrices;
    // }

    return totalAmount;
  };
  var cancelRefund = async (item) => {
    var products = item["ProductDetail"];
    var ProcessOrders = [];
    for (let i = 0; i < products.length; i++) {
      ProcessOrders.push(products[i]["ProcessOrderID"]);
    }

    setLoading(true);
    try {
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/payment/refund-cancel`,
        { ProcessOrders }
      );
      if (response.data.status) {
        firetoast("Refund request cancelled", "success", 3000, "top-center");
        getUserRefunds();
        setLoading(false);
      } else {
        var { message, error } = response.data;
        firetoast(message || error, "default-error");
      }
    } catch (e) {
      firetoast("Something went wrong", "default-error");
      setLoading(false);
    }
  };
  return loading ? (
    <>
      <Loading text="Getting Data" />
    </>
  ) : records.length < 1 ? (
    <div
      className="text-center mt-2"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minheight: "100px",
      }}
    >
      <NoData />
    </div>
  ) : (
    <>
      <div>
        <div className=" mt-2 mb-2">
          <div style={{ textAlign: "right" }}>
            <div
              className="btn-group btn-left-padding"
              role="group"
              aria-label="Basic example"
            >
              <button
                className="btn btn-light btn-sm text-default"
                type="button"
                onClick={() => paginateData("previous")}
              >
                <i className="fa fa-arrow-left"></i>
              </button>
              <button className="btn btn-light btn-sm" type="button">
                {paginate.offset + 1}
              </button>
              <button
                className="btn btn-light btn-sm text-default"
                type="button"
                data-bs-original-title=""
                title=""
                onClick={() => paginateData("next")}
              >
                <i className="fa fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        {records.map((record, index) => (
          <div className="col-lg-6 col-md-6 col-sm-12 mt-2" key={index}>
            <div class="card">
              <div class="bg-white card-header">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <div style={{ fontSize: "15px" }}>
                      Order:
                      <Link
                        class="td-none"
                        to={`/order-details/${record.OrderNumber}`}
                      >
                        {record.OrderNumber}
                      </Link>
                    </div>
                    <div>
                      <span class="text-secondary">
                        Placed Date:{" "}
                        {moment(record.OrderDate).format("DD-MM-YYYY")}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Link
                      class="td-none text-orange"
                      to="#"
                      style={{ fontSize: "15px" }}
                    >
                      {record.ProcessStatus}
                    </Link>
                  </div>
                  <div>
                    {/* {record["ProductDetail"][0]["RefundStatusHistory"] &&
                      JSON.parse(
                        record["ProductDetail"][0]["RefundStatusHistory"]
                      ).length === 1 && (
                      )} */}
                    {!record["ProductDetail"][0]["RefandDeliveryPic"] && (
                      <button
                        className="btn btn-sm btn-dark"
                        onClick={() => cancelRefund(record)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div class="card-body">
                <div class="collapse show">
                  <div class="d-flex align-items-center justify-content-between">
                    <div>
                      <span>
                        Transaction ID :{" "}
                        <Link class="text-orange" to="#">
                          {record.TransactionID}
                        </Link>
                      </span>
                    </div>
                    <div>
                      {" "}
                      {/* <span>
                        <a class="text-dark" href="/request-refund/056">
                          Request Refund
                        </a>
                      </span> */}
                    </div>
                  </div>
                  {record["ProductDetail"].map((product, prod_index) => (
                    <div class="row mt-2" key={prod_index}>
                      <div class="col-2 ">
                        <img
                          class="w-100"
                          src="http://192.168.100.25:3001/public\imageGallery\16527791145141809efa5728df9de6c111d057e9a3107.PNG"
                          style={{ maxWidth: "fit-content", height: "75px" }}
                        />
                      </div>
                      <div class="col-6 m-auto">
                        <div>
                          <div>
                            <h5 class="mb-0">{product.Title}</h5>
                          </div>
                          <div class="pt-1 pb-1">
                            <p class="mb-0" style={{ fontWeight: "600" }}>
                              Variations: {GetPriceOrVariation(product, 1)}
                            </p>
                          </div>
                          <div class="text-orange" style={{ fontSize: "13px" }}>
                            Price: {product["Currency"]}{" "}
                            {GetPriceOrVariation(product, 0)}
                          </div>
                        </div>
                      </div>
                      <div class="col-4 m-auto"></div>
                    </div>
                  ))}
                </div>
              </div>
              {/* <div class="card-footer">
                <div style={{ textAlign: "right" }}>
                  Total Paid :{" "}
                  <span>
                    <b class="text-default">
                      {" "}
                      {records[0] && records[0].ProductDetail[0].Currency}{" "}
                      {records[0] && orderTotalAmount()}
                    </b>
                  </span>
                </div>
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
