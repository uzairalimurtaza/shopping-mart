import { useParams, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import BanglaBazarApi from "./../../Api/BanglaBazarApi";
import Endpoint from "./../../../Utils/Endpoint";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from 'jspdf';

function RefundInstruction() {
    const { orderNumber, products, total } = useParams();
    const [Orders, setOrders] = useState([]);
    const [orderDetail, setOrderDetail] = useState(null);
    const [userDetail, setUserDetail] = useState(null);
    const [currentProducts, setCurrentProducts] = useState([]);
    const printRef = useRef();
    useEffect(() => {
        getDetails();
    }, []);
    useEffect(() => {
        if (orderDetail) {
            let array = []
            for (let i = 0; i < orderDetail.ProductDetail.length; i++) {
                let ProductID = orderDetail.ProductDetail[i].ProductID
                console.log(ProductID, "inside at index", i)
                if (products.includes(ProductID)) {
                    array.push(orderDetail.ProductDetail[i])
                }
            }
            setCurrentProducts(array)
        }
    }, [Orders, orderDetail]);

    var getDetails = async () => {
        try {
            const response = await BanglaBazarApi.get(
                `${Endpoint}/api/admin/orderDetails/${orderNumber}`
            );
            console.log(response);
            setOrders(response.data.orderDetails["ProductDetail"]);
            setOrderDetail(response.data.orderDetails);
            setUserDetail(response.data.orderShippingDetail);



        } catch (e) {
            console.log(e);
        }
    };


    async function PrintElem() {
        const element = printRef.current;
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'landscape',
        });
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Order_${orderNumber}_refund-instructions.pdf`);
    }

    return (

        <>
            <div className="container" ref={printRef}>
                <div>
                    <div class="card mt-5">
                        <div class="card-body">
                            <div class="container">
                                <div class="col-md-12">
                                    <div class="invoice" id="invoice">
                                        <div class="invoice-company text-inverse d-flex justify-content-between">
                                            <div>
                                                <img
                                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA11JREFUeNrEV9GR2kAMtRn+4w4OKohdQXAaiKng7N/8cFTAUQHwk19DBZgGgqkAOsDXgdNBpMxT5p1iOO7mbqIZjfF6Vys9vdWKIPjPEr5l0eTH11gfoiPRgehJdCe6XH3/2X6oA7J5Lo9StBHdYPiTaI7fqThx+hAHZHONeC+6lk0K9y3CN0VkeCsS/VcCMBOtbXOgMcBYLe9j+X0UfRB9vMVg75UOjAx2SoU6tVdeiBOalkr0y60G+x0Qz7CRieZzSu8Nnn6TDHOfjA9wcgaUTNTBufGk58i1x6tCnIoqpC3lViXC8+AcqIiQmo4SCNWwlSKQGIhlf0l4jVz4XhLLNd8pxjMYNA6oc2dytJDxdYe9LVAehjSgORzi/REQb8yAjB2xmcpUxpcdhh8BecDBkL2VjFXk6LpH+Vth8gPxoERqAuKBpmQGI7z5gDZXmTun1N5W0cYR1ZTFPUc2zrHJn9wrxMinkbB080o4Z9HbvM9unqH4xCRsifk1TdbxtYsqxlhmRMJzRM7Nac3G2avYsZBIpgYShQdwqjYUSUBcaMnpBARu4FzVUSWf2cO7cmAa0oQjjKTXyigVIN1kQWmbI9dD73SHM1usSUJXhLaWQ9FfL5Vk3IDqxBJE9pB7ucNxVgfHWozCDu8mRJSXpIAzO6y7RQ58bXddRhEciG4wFkEHrnxfkoZO2/PrGLldEFPfkoLI6skF+advYBKekfvpK0nYAoElruGXSPisb+hTRI1tjpYrcwXFR3+PzROcoBg2ZnDOt3AjHNEGfYMGnHMp3mDzDAbV0BnoBK4BsRpQAK2CClHu1pg9Reuo3xCUov2tR2SqXak0yTkYkMiiqalMV1jbujvh3pE2v1SKY9dwBFyaUSdi6gv8tc1NC6NwqW+4YwdqO8e4fqeYOLYoXdUrPFEB64qO7wLjS2fvBCJqag4hkeT4hobEOHGie/7IKPmGxJ+C8EK/v0KuB8jhCFEsEEVF800SRLegE5Ej8h3eR7AXWR3oEYRr9G0nbLSnOz4lkrZXmtIABSwGkmMEUcLeBHYSa0r7Lo+16wd8KgKC9+BOyJrIdYK9ikj3Lv8LPFlTXMMp3fNZB/Pf7Z/RHC11iapZ0zG1e75FWf7QP6cL1zfcIfLWjtqt9n4LMAChhcYrym0g0QAAAABJRU5ErkJggg=="
                                                    style={{ height: "25px" }}
                                                />
                                                BanglaBazar{" "}
                                            </div>
                                            <div></div>
                                        </div>
                                        <div class="invoice-header">
                                            <div class="invoice-to">
                                                <address class="m-t-6 m-b-5">
                                                    <strong class="text-inverse">Customer Delivery Information</strong>
                                                    <br />
                                                    <small class="text-orange"> Name :</small>  {userDetail?.DeliveryName}
                                                    <br />
                                                    <small class="text-orange"> Address: </small>   {userDetail?.DeliveryAddress1}
                                                    <br />
                                                    <small class="text-orange"> Phone # </small>  {userDetail?.DeliveryPhoneNumber}
                                                </address>
                                            </div>
                                            <div class="invoice-from ml-15">
                                                <address class="m-t-5 m-b-5 ">
                                                    <strong class="text-inverse">Customer Payment Information</strong>
                                                    <br />
                                                    <small class="text-orange"> Name :</small>  {orderDetail?.PaymentName}
                                                    <br />
                                                    <small class="text-orange"> Payment Method : </small>  {orderDetail?.PaymentType}
                                                    <br />
                                                    <small class="text-orange"> Payment Gateway : </small>  {orderDetail?.PaymentType == "card" ? orderDetail?.ProductDetail[0]["GatewayID"] == 4 ? "SSL Commerz" : "Stripe" : null}

                                                </address>
                                            </div>

                                            <div class="invoice-date">
                                                <strong class="text-inverse">Order Information</strong>
                                                <div class="date text-inverse m-t-5"></div>
                                                <div class="invoice-detail">
                                                    <small class="text-orange"> Order # </small>{orderNumber}
                                                    <br />
                                                    <small class="text-orange"> TranID # </small>{orderDetail?.TransactionID}
                                                    <br />
                                                    <small class="text-orange"> Shipped By : </small> {orderDetail?.DeliveryStatus}
                                                    <br />
                                                    <small class="text-orange"> Order Placed on : </small> {orderDetail?.OrderDate}
                                                    <br />
                                                    <small class="text-orange"> Order Delivered on : </small> {orderDetail?.DeliveryDate}

                                                </div>
                                            </div>
                                        </div>
                                        <div class="invoice-content">
                                            <div class="table-responsive">
                                                <table class="table table-invoice">
                                                    <thead>
                                                        <tr>
                                                            <th class="text-center">Product ID</th>
                                                            <th class="text-center">Product Title</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr class="text-center">
                                                            <td>
                                                                {
                                                                    currentProducts.length > 0 && currentProducts.map(item => {
                                                                        return (

                                                                            <div>{item.ProductID}</div>


                                                                        )
                                                                    })
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    currentProducts.length > 0 && currentProducts.map(item => {
                                                                        return (

                                                                            <div>{item.Title}</div>

                                                                        )
                                                                    })
                                                                }
                                                            </td>

                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="invoice-price">
                                                <div class="invoice-price-left">
                                                </div>
                                                <div class="invoice-price-right">
                                                    <small>Refund Total</small>{" "}
                                                    <span class="f-w-600">{total}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>{" "}
                        </div>{" "}
                    </div>
                </div>
            </div>
            <div>
                <div className="text-center text-danger mt-5" style={{ fontSize: "16px" }}>
                    You need to print this refund instruction page and need to
                    include that in return shipping package
                </div>
                <button
                    className="btn btn-default btn-lg float-right " style={{ marginRight: "125px" }}
                    onClick={() => PrintElem()}
                >
                    Download
                </button>
            </div>


        </>
    );
}
export default RefundInstruction;
