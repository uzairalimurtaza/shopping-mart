function ServiceInfo() {
  return (
    <div className="service-info mt-5 mb-5">
      <div className="row">
        <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 ">
          <div className="d-flex service-content">
            <div className="service-icon">
              <i className="fal fa-truck-pickup"></i>
            </div>
            <div className="service-content-detail">
              <div className="detail-heading">Free Shipping & Returns</div>
              <div className="detail-desc">For all orders over $99</div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 ">
          <div className="d-flex  service-content">
            <div className="service-icon">
              <i className="fas fa-money-check-alt"></i>
            </div>
            <div className="service-content-detail">
              <div className="detail-heading">Secure Payment</div>
              <div className="detail-desc">We ensure secure payment</div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 ">
          <div className="d-flex  service-content">
            <div className="service-icon">
              <i className="fas fa-hand-holding-usd"></i>
            </div>
            <div className="service-content-detail">
              <div className="detail-heading">Money Back Guarantee</div>
              <div className="detail-desc">Any back within 30 days</div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 ">
          <div className="d-flex  service-content">
            <div className="service-icon">
              <i className="fas fa-headset"></i>
            </div>
            <div className="service-content-detail">
              <div className="detail-heading">Customer Support</div>
              <div className="detail-desc">Call or email us 24/7</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ServiceInfo;
