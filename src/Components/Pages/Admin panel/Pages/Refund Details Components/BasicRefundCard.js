export function BasicRefundCard({ RefundDetail, type }) {
  let shippingMode = (mode) => {
    if (mode === "VS") return " Vendor Shipping";
    if (mode === "pathao") return " Pathao";
    if (mode === "dd") return " Delivery Driver";
    if (mode === "usps") return " USPS";
  };
  if (type === "shipping") {
    return (
      <div className="basic-refund-card">
        <h5>Shipping Through</h5>
        <h5>
          <i class="fas fa-map-marker-alt text-default"></i>
          {shippingMode(RefundDetail["DeliveryStatus"])}
        </h5>
        <p className="text-secondary">
          Tracking No : {RefundDetail["TrackingNumber"]}
        </p>
      </div>
    );
  } else if (type === "to") {
    return (
      <div className="basic-refund-card">
        <h5>Shipping to</h5>
        <h5>
          <i class="fas fa-map-marker-alt text-default"></i>{" "}
          {RefundDetail.ProductDetail[0]["StoreCity"]}
        </h5>
        <p className="text-secondary">{`${RefundDetail.ProductDetail[0]["StoreAddress"]}`}</p>
      </div>
    );
  } else {
    return (
      <div className="basic-refund-card">
        <h5>Shipping from</h5>
        <h5>
          <i class="fas fa-map-marker-alt text-default"></i>{" "}
          {RefundDetail.ProductDetail[0]["DeliveryCity"]}
        </h5>
        <p className="text-secondary">
          {RefundDetail.ProductDetail[0]["DeliveryAddress"]}
        </p>
      </div>
    );
  }
}
