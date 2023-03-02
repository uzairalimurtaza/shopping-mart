import { Link } from "react-router-dom";
import { WebsiteHeader } from "../Layout/Header";
import { Breadcrumb } from "reactstrap";
import { BreadcrumbItem } from "reactstrap";
import { NewsLetter } from "../Layout/NewsLetter";
import { Footer } from "../Layout/Footer";
import { useParams, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import BanglaBazarApi from "../../../Api/BanglaBazarApi";
import Endpoint from "../../../../Utils/Endpoint";
import firetoast from "../../../../Helpers/FireToast";
import { RequiredField } from "../../../../Utils/Required-field";
import { numberWithCommas } from "../../../../Helpers/NumberWithCommas";
import moment from "moment";
import NoStore from "../../../../assets/images/no-store.svg";
import CheckEmpty from "../../../../Utils/CheckEmpty";



function PaidReturnProducts() {
    const { orderNumber } = useParams();
    const history = useHistory();
    const [Orders, setOrders] = useState([]);
    const [RefundReason, setRefundReason] = useState(null);
    const [AccTitle, setAccTitle] = useState(null);
    const [AccNo, setAccNo] = useState(null);
    const [subTotal, setSubTotal] = useState(0);
    const [productPicture, setProductPicture] = useState(null);
    const [orderDetail, setOrderDetail] = useState(null);
    const [days, setDays] = useState(null);
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [disableText, setDisableText] = useState();
    const [productArray, setProductArray] = useState([]);
    const [productCheck, setProductChecked] = useState(false);
    const [freeReturnOrders, setFreeReturnOrders] = useState([]);
    const [records, setRecords] = useState([])
    const [serviceName, setServiceName] = useState(null)
    const [selectedService, setSelectedService] = useState(null)
    const [trackingNumber, setTrackingNumber] = useState(null)

    const refundReasons = [
        "Item is defective / not functioning / does not turn on",
        "Item is not advertised over website",
        "I recieved a wrong / fake item",
        "Item is missing mentioned accessories",
        "Item is missing freebies/bundled items",
        "I did not order this size",
        "Item is damaged / broken / has dent and scratches",
        "item does not fix me",
    ];

    useEffect(() => {
        getDetails();
        getServicesAndInit();
    }, []);
    useEffect(() => {
        if (orderDetail) {
            calculateSubtotal();
            //setDays(orderDetail[0][DeliveryDate])
        }
        let tempArray = [];
        if (Orders && Orders.length) {
            console.log(Orders, "Orders")
            let _days = getDateDifference(Orders[0]["DeliveryDate"])
            setDays(parseInt(Math.abs(_days)));
            var found = false;
            for (let i = 0; i < Orders.length; i++) {
                if (Orders[i]["checked"]) {
                    console.log("in inside")
                    tempArray.push(Orders[i]?.ProductID)
                }
            }
            console.log(tempArray, "tempArray")
            // setProductArray(document.write(tempArray.toString()))
        }
    }, [Orders, orderDetail]);

    var getDetails = async () => {
        try {
            const response = await BanglaBazarApi.get(
                `${Endpoint}/api/admin/orderDetails/${orderNumber}`
            );
            if (response) {
                let tempArray = [];
                let length = response.data.orderDetails["ProductDetail"].length
                for (let i = 0; i < length; i++) {
                    let temp = response.data.orderDetails["ProductDetail"]
                    let FreeProductReturn = temp[i].FreeProductReturn
                    if (FreeProductReturn === "N") {
                        tempArray.push(response.data.orderDetails["ProductDetail"])
                    }
                }
                setFreeReturnOrders(tempArray);
            }
            setOrders(response.data.orderDetails["ProductDetail"]);
            setOrderDetail(response.data.orderDetails);
        } catch (e) {
            console.log(e);
        }
    };
    let getServicesAndInit = async () => {
        try {
            var resp = await BanglaBazarApi.get(
                `${Endpoint}/api/courier/get-courier`
            );

            try {
                setRecords(resp["data"].getCourierService);
            } catch (e) {
                console.log(e);
            }
        } catch (e) {
            console.log(e);
        }
    };
    let getDateDifference = (orderDate) => {
        var now = moment(new Date());
        var end = moment(orderDate).format("YYYY-MM-DD");
        var duration = moment.duration(now.diff(end));
        var days = duration.asDays();

        return days;
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
    let SubmitRequest = async (e) => {
        e.preventDefault();
        var obj = {
            OrderNumber: orderNumber,
            Product: [],
            RefundReason,
        };
        var found = false;
        for (let i = 0; i < Orders.length; i++) {
            if (Orders[i]["checked"]) {
                Orders[i]["RefundReason"] = RefundReason;
                Orders[i]["RefandAmount"] = GetPriceOrVariation(Orders[i], 0);
                Orders[i]["RefandShippingLabel"] = orderDetail?.DeliveryStatus;
                Orders[i]["RefandDropOffStoreID"] = Orders[i]?.VendorStoreID;
                obj["Product"].push(Orders[i]);
                found = true;
            }
        }

        if (!found) {
            return firetoast(
                "Please select the product you wan't to refund.",
                "default-error"
            );
        }
        if (!Orders[0]["GatewayID"]) {
            if (!AccTitle || AccTitle === "") {
                return firetoast("Account Title can't be empty", "default-error");
            }
            if (!AccNo || AccNo === "") {
                return firetoast("Account No can't be empty", "default-error");
            }
        }
        if (!RefundReason || RefundReason === "") {
            return firetoast("Refund reason can't be empty", "default-error");
        }

        if (!productPicture || productPicture === "") {
            return firetoast(
                "Product picture is required to proceed!",
                "default-error"
            );
        }
        if (CheckEmpty(trackingNumber)) {
            return firetoast("Tracking Number cannot be empty", "error", 3000, "top-right");
        }
        // var __data = obj["Product"].map((val) => {
        //   val.RefandShippingLabel = val.DeliveryStatus;
        //   val.RefandDropOffStoreID = val.VendorStoreID;
        // });
        // console.log(obj["Product"]);
        for (let i = 0; i < obj["Product"].length; i++) {
            obj["Product"][i].RefandShippingLabel = obj["Product"][i].DeliveryStatus;
            obj["Product"][i].RefandDropOffStoreID = obj["Product"][i].VendorStoreID;
        }
        try {
            var form = new FormData();
            form.append("OrderNumber", orderNumber);
            form.append("RefundReason", RefundReason);
            form.append("ProductDetail", JSON.stringify(obj["Product"]));
            form.append("RefandItemsPic", productPicture);
            form.append("AccountNumber", AccNo);
            form.append("AccountTitle", AccTitle);
            form.append("DeliveryStatus", orderDetail?.DeliveryStatus);
            form.append("UserID", orderDetail?.ProductDetail[0]["UserID"]);
            form.append("type", "N");
            const response = await BanglaBazarApi.post(
                `${Endpoint}/api/payment/refund-form`,
                form
            );
            if (response.data.status) {
                firetoast(
                    <div className="text-dark text-center">
                        Your Request has been submitted!
                        <div>Admin will contact you shortly!</div>
                    </div>,
                    "success",
                    3000,
                    "text-center"
                );
                setTimeout(() => {
                    history.push("/order-details");
                }, 3000);
            } else {
                firetoast(
                    response.data.error || response.data.message,
                    "default-error"
                );
            }
        } catch (e) {
            console.log("error", e);
        }
    };
    let calculateSubtotal = () => {
        let currentOrders = Orders;
        let _subTotal = 0;
        for (let i = 0; i < currentOrders.length; i++) {
            let total = 0;
            if (currentOrders[i]["checked"]) {
                total = parseFloat(GetPriceOrVariation(currentOrders[i], 0));
                _subTotal += total * currentOrders[i]["Quantity"];
                var tx_price =
                    _subTotal * (parseFloat(currentOrders[i]["ItemsEstimatedTax"]) / 100);

                _subTotal = _subTotal + tx_price;
                // if (currentOrders[i]["VendorPaymentStatus"] === "N") {
                //  _subTotal -= parseFloat(currentOrders[i]["ItemsShippingHandling"]);
                // }
                if (currentOrders[i]["FreeProductReturn"] === "N" && currentOrders[i]["VendorPaymentStatus"] === "N" && currentOrders[i]["DeliveryStatus"] !== "usps") {
                    _subTotal -= parseFloat(currentOrders[i]["ItemsShippingHandling"]);
                    currentOrders[i]["RefandShippingCost"] = currentOrders[i]["ItemsShippingHandling"];
                } else {
                    currentOrders[i]["RefandShippingCost"] = 0;
                }
            }
        }
        var _totalAmount = 0;
        if (orderDetail["PaymentType"] === "cod") {
            _totalAmount = _subTotal;
        } else {
            _totalAmount = _subTotal;
        }
        if (_totalAmount == 0) {
            setDisableSubmit(true);
        }
        else if (_totalAmount < 0) {
            setDisableText(",as product has no free return and you will charge origional shipping cost so subtotal is in negative");
            setDisableSubmit(true);
        } else {
            setDisableSubmit(false);
        }
        setSubTotal(numberWithCommas(_totalAmount.toFixed(2)));
        setOrders(currentOrders);
    };
    let getDeliveryOverview = (status) => {
        switch (status) {
            case "dd":
                return "This order will be picked by BanglaBazar delivery driver after refund request approval.";
            case "VS":
                return "This order will be picked by Vendor after refund request approval.";
            case "pathao":
                return "This order will be picked by Pathao delivery driver after refund request approval.";
            default:
                return "After refund request approval please return the product to the vendor store from where it was picked.";
        }
    };
    return (
        <>
            {freeReturnOrders.length > 0 ? <div className="container">
                <>
                    <div className="pt-2 pb-0">
                        <Breadcrumb listTag="div">
                            <BreadcrumbItem
                                href="/"
                                tag="a"
                                className="td-none"
                                style={{ color: "#B1B1B1" }}
                            >
                                Home
                            </BreadcrumbItem>
                            <BreadcrumbItem
                                href="/order-details"
                                tag="a"
                                className="td-none"
                                style={{ color: "#787878" }}
                            >
                                Order
                            </BreadcrumbItem>
                            <BreadcrumbItem
                                href="#"
                                tag="a"
                                className="td-none"
                                style={{ color: "#787878" }}
                            >
                                Refund
                            </BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                </>
                <div className="mt-5">
                    <div className="text-center">
                        <h4 className="text-default">Request Refund</h4>
                    </div>
                    <div className="mt-3">
                        <div className="row">
                            <div className="col-lg-9 col-md-12 col-sm-12 order-2 order-sm-2 order-lg-1">
                                <h4 className="text-dark">Products</h4>
                                <span>Select the products to refund from below list : </span>
                                {Orders.map((item, index) => (
                                    item.FreeProductReturn === "N" ?
                                        <div className="row mt-2 align-items-center" key={index} >
                                            <div className="col-1 ">
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        className="form-check-input default-check-color"
                                                        type="checkbox"
                                                        disabled={item.ReturnReason}
                                                        onChange={(e) => {
                                                            var temp = [...Orders];
                                                            temp[index]["checked"] = e.target.checked;
                                                            setOrders(temp);
                                                            calculateSubtotal();
                                                            if (e.target.checked) {
                                                                setProductArray(item.ProductID)
                                                                setProductChecked(true);
                                                                console.log(productArray, "productArray1")
                                                            }
                                                            else {
                                                                //   const index = productArray.indexOf(item.ProductID);
                                                                //  if (index > -1) { // only splice array when item is found
                                                                //   productArray.splice(index, 1); // 2nd parameter means remove one item only
                                                                //   }
                                                                //   console.log(productArray,"productArray2")
                                                                setProductChecked(false);
                                                            }
                                                        }}
                                                        id="inlineCheckbox3"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-2 ">
                                                <img
                                                    className="w-100"
                                                    style={{ maxWidth: "fit-content", height: "75px" }}
                                                    src={`${Endpoint}/${item.Small}`}
                                                />
                                            </div>
                                            <div className="col-7 m-auto">
                                                <div>
                                                    <div>
                                                        <h5 className="mb-0">{item.Title}</h5>
                                                    </div>
                                                    <div className="pt-1 pb-1">
                                                        <p className="mb-0" style={{ fontWeight: "600" }}>
                                                            Variations: {GetPriceOrVariation(item, 1)}
                                                        </p>
                                                    </div>
                                                    <div
                                                        className="text-orange"
                                                        style={{ fontSize: "13px" }}
                                                    >
                                                        Price: {item.Currency} {GetPriceOrVariation(item, 0)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-2">
                                                {item["FreeProductReturn"] === "N" && (item["DeliveryStatus"] === "VS" || item["DeliveryStatus"] === "SP") && (
                                                    <span className="text-orange">Not Free Shipping</span>
                                                )}
                                                {item["FreeProductReturn"] === "N" && item["DeliveryStatus"] === "usps" && (
                                                    <span className="text-orange">Not Free Shipping</span>
                                                )}
                                                {item["FreeProductReturn"] === "N" && item["DeliveryStatus"] !== "usps" && (

                                                    <span className="text-orange">Not Free Shipping {item["ItemsShippingHandling"]} {item.Currency} will be charged</span>
                                                )}

                                            </div>
                                            <div>
                                                {item.ReturnReason && (
                                                    <span className="text-danger">
                                                        You already have requested refund for this product
                                                    </span>
                                                )}
                                            </div>
                                        </div> : <></>
                                ))}
                                <h4 className="text-dark">Details</h4>
                                <small>
                                    Usually payments are refunded via the method which was used
                                    while checking out!
                                </small>
                                <form>
                                    {Orders && Orders[0] && !Orders[0]["GatewayID"] && (
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <label for="exampleInputEmail1">
                                                    Account Title <RequiredField />{" "}
                                                </label>
                                                <input
                                                    type="name"
                                                    className="form-control"
                                                    onChange={(e) => setAccTitle(e.target.value)}
                                                />
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <label for="exampleInputEmail1">
                                                    Account No <RequiredField />{" "}
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    onChange={(e) => setAccNo(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                            <label for="exampleInputEmail1">
                                                Refund Reason
                                                <RequiredField />{" "}
                                            </label>
                                            <select
                                                className="form-control"
                                                onChange={(e) => setRefundReason(e.target.value)}
                                            >
                                                <option value={""}>Refund reason...</option>
                                                {refundReasons.map((item, index) => (
                                                    <option value={item} key={index}>
                                                        {item}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                            <label for="exampleInputEmail1">
                                                Product Image
                                                <RequiredField />{" "}
                                            </label>
                                            <input
                                                className="form-control"
                                                type="file"
                                                accept="image/png, image/gif, image/jpeg"
                                                onChange={(e) =>
                                                    setProductPicture(
                                                        e.target.files[0] && e.target.files[0]
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="mt-3 text-dark">Courier Service Details</h4>
                                        <div className="row ">
                                            <div className="mt-1 mb-1">This info is necessary for vendor/admin to keep track of this refund order </div>
                                            <div className="col-4">
                                                <label className="mt-1 mb-2">Courier Service <RequiredField /></label>
                                                <select className="form-control" onChange={(e) => {
                                                    if (e.target.value === "Select") { e.preventDefault() }
                                                    else {
                                                        setSelectedService(JSON.parse(e.target.value).CourierID)
                                                        setServiceName(JSON.parse(e.target.value).CourierName)
                                                    }
                                                }}>
                                                    <option value="Select">Select Service</option>
                                                    {records.map((item, index) => <option value={JSON.stringify(item)}>{item.CourierName}</option>)}\
                                                </select>
                                            </div>
                                            {selectedService && selectedService !== "Select" && <div className="col-4">
                                                <label>Tracking Label <RequiredField /></label>
                                                <input className="form-control" onChange={(e) => setTrackingNumber(e.target.value)} />
                                            </div>}
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <button
                                            className="btn btn-default"
                                            type="button"
                                            onClick={(e) => SubmitRequest(e)}
                                            disabled={disableSubmit || !serviceName}
                                        >
                                            Submit Request
                                        </button>
                                    </div>
                                    {disableSubmit && !serviceName && (
                                        <div className="text-danger mt-2">
                                            Unable to proceed {disableText}
                                        </div>
                                    )}
                                    <div className="d-flex align-items-center justify-content-between">

                                    </div>
                                </form>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12 m-auto order-1 order-sm-1 order-lg-2">
                                {/* <h4 className="text-dark">Refund Amount</h4> */}

                                {/* {Orders && productCheck &&
                                    Orders.DeliveryStatus != "usps_intl" && Orders.DeliveryDate != "dhl" && (
                                        <div>

                                            {" "}
                                            <span>
                                                <Link

                                                    to={`/request-refund-link/${orderNumber}/${subTotal}/${productArray.toString()}`}
                                                    className="text-success"
                                                >
                                                    Refund Instruction Link

                                                </Link>
                                            </span>
                                        </div>
                                    )} */}
                                <div className="text-danger mt-2 mb-2" style={{ fontSize: "11px", fontWeight: "bold" }}>
                                    {Math.abs(days - parseInt(14))} days are left until you can request refund for this order
                                </div>


                                <div className="order-summary-box">
                                    <div className="p-2">
                                        <small>
                                            <i class="fas fa-info-circle text-orange"></i> This amount
                                            is exclusive of shipping amount and tax paid during
                                            checkout
                                        </small>
                                    </div>
                                    <h5 className="p-3 mb-0 text-default">Subtotal</h5>
                                    <div className="section-1">
                                        <div className="text-center">
                                            <span
                                                className="summary-attrib"
                                                style={{ fontSize: "18px" }}
                                            >
                                                {Orders && Orders[0] && Orders[0]["Currency"]}{" "}
                                                <span
                                                    className="text-dark"
                                                    style={{ fontSize: "22px" }}
                                                >
                                                    {subTotal}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="order-summary-box mt-2">
                                    <div className="p-2">
                                        <i class="fas fa-info-circle text-orange"></i>{" "}
                                        {orderDetail &&
                                            getDeliveryOverview(orderDetail["DeliveryStatus"])}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> : <div className="text-center no-store-container ">
                <div className="mt-3">
                    <img src={NoStore} className="img-fluid no-store-img " />
                    <h2 className="ftw-400 mt-3">No Products Data Found </h2>
                </div>
            </div>}

        </>
    );
}
export default PaidReturnProducts;
