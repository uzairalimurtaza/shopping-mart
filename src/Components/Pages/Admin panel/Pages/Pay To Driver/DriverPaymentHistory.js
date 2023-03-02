import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import firetoast from "../../../../../Helpers/FireToast";
import Endpoint from "../../../../../Utils/Endpoint";
import Loading from "../../../../../Utils/Loading";
import BanglaBazarApi from "../../../../Api/BanglaBazarApi";
import moment from "moment";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
export function DriverPaymentHistory() {
  const [records, setRecords] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [productRecords, setProductRecords] = useState([]);
  var { driverId } = useParams();
  useEffect(() => {
    getRecords();
  }, []);
  var getRecords = async () => {
    setLoading(true);
    try {
      const response = await BanglaBazarApi.get(
        `${Endpoint}/api/admin/get-driverPaymentDetails/${driverId}`
      );

      if (response.data.status) {
        setLoading(false);

        setRecords(response.data.getDriverDetails);
      } else {
        setLoading(false);

        var { message, error } = response.data;
        firetoast(message || error, "default-error");
      }
    } catch (e) {
      console.log(e);
      setLoading(false);

      firetoast("Something went wrong", "default-error");
    }
  };
  var setAndViewProducts = async (products) => {
    setProductRecords(products);
    setOpen(true);
  };
  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between">
        <h3 className="ftw-400">
          <Link to="/panel/search/pay-to-driver">
            <i class="fas fa-chevron-circle-left text-dark"></i>
          </Link>
          Payment Records
        </h3>
      </div>
      <div className="card mt-2">
        <div className="card-body">
          <div>
            <div className="mt-3 table-responsive">
              {isLoading ? (
                <Loading />
              ) : (
                <table className="table table-bordered">
                  <thead>
                    <th>Order Number</th>
                    <th>Order Date</th>
                    <th>DriverPaymentAmount</th>
                    <th>Delivery Date</th>
                    <th>Total Products</th>
                    <th>Payment Date</th>
                    <th></th>
                    <th></th>
                  </thead>
                  <tbody>
                    {records.map((record, index) => (
                      <tr key={index}>
                        <td className="pt-18">{record.OrderNumber}</td>
                        <td className="pt-18">
                          {moment(record.OrderDate).format("DD-MM-YYYY")}
                        </td>
                        <td className="pt-18">
                          BDT {record.DriverPaymentAmount}
                        </td>
                        <td className="pt-18">
                          {moment(record.DeliveryDate).format("DD-MM-YYYY")}
                        </td>
                        <td className="pt-18">{record.ProductDetail.length}</td>
                        <td>
                          {moment(
                            record.ProductDetail[0]["ProcessDate"]
                          ).format("DD-MM-YYYY")}
                        </td>
                        <td>
                          <Link
                            to="#"
                            onClick={() =>
                              window.open(
                                `${Endpoint}/${record.ProductDetail[0]["PaymentConfirmation"]}`,
                                "_blank"
                              )
                            }
                          >
                            View Document
                          </Link>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() =>
                              setAndViewProducts(record.ProductDetail)
                            }
                          >
                            View Products
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
      <div></div>
      <Modal
        isOpen={open}
        toggle={() => setOpen(!open)}
        size="md"
        centered
        backdrop={"static"}
      >
        <ModalHeader toggle={() => setOpen(!open)}>Product Detail</ModalHeader>
        <ModalBody>
          <form>
            <div class="form-group">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <th>Product Name</th>
                    <th>Order Number</th>
                    <th>Order Date</th>
                    <th>Payment Type</th>
                    <th>Delivery City</th>
                    <th>Payment Document</th>
                  </thead>
                  <tbody>
                    {productRecords.map((item, index) => (
                      <tr key={index}>
                        <td>{item.Title}</td>
                        <td>{item.OrderNumber}</td>
                        <td>
                          {item.OrderDate &&
                            moment(item.OrderDate).format("DD-MM-YYYY")}
                        </td>
                        <td>
                          {item.PaymentType === "cod" && "COD"}
                          {item.PaymentType === "card" && "Card"}
                        </td>

                        <td>{item.DeliveryCity}</td>
                        <td>
                          <Link
                            to="#"
                            className="td-none text-default"
                            onClick={() =>
                              window.open(
                                `${Endpoint}/${item.PaymentConfirmation}`,
                                "_blank"
                              )
                            }
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}
