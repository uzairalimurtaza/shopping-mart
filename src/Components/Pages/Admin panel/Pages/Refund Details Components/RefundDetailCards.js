export function RefundDetailCard({
  title,
  colorClass,
  name,
  address,
  phone,
  email,
}) {
  return (
    <>
      <div className="text-center mt-2">
        <h6 style={{ fontSize: "15px" }}>{title}</h6>
      </div>
      <div className="card mt-2 refund-detail-card">
        <div className={`card-header text-center bg-${colorClass} text-white`}>
          <h6 style={{ fontSize: "15px" }}>{name}</h6>
        </div>
        <div className="card-body">
          <div className="text-center mt-2">
            <i className={`fas fa-phone-alt text-${colorClass} fa-2x`}></i>
            <div className="text-secondary customer-detail-text">
              {phone === "null" ? "N/A" : phone}
            </div>
          </div>
          <div className="text-center mt-3">
            <i className={`fas fa-envelope text-${colorClass} fa-2x`}></i>
            <div className="text-secondary customer-detail-text">
              {email || "N/A"}
            </div>
          </div>
          <div className="text-center mt-3">
            <i className={`fas fa-map-marker-alt text-${colorClass} fa-2x`}></i>
            <div className="text-secondary customer-detail-text">{address}</div>
          </div>
        </div>
      </div>
    </>
  );
}
