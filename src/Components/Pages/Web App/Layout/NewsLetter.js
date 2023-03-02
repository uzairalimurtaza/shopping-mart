import SSLCommerz from "../../../../assets/images/sslcommerz.png"
export function NewsLetter() {
  return (
    <>
      <div className=" mt-5 landing-newsletter">
        <div className="row m-0">
          <div
            className="col-lg-10 col-sm-12 m-auto"
            style={{ paddingTop: "60px", paddingBottom: "50px" }}
          >
            <div className="row m-0">
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="d-flex" style={{ alignItems: "center" }}>
                  <div>
                    <i
                      className="far fa-envelope text-white"
                      style={{ fontSize: "35px" }}
                    ></i>
                  </div>
                  <div style={{ marginLeft: "30px" }}>
                    <div className="text-white">
                      SUBSCRIBE TO OUR NEWSLETTER
                    </div>
                    <div className="text-white">
                      Get all the latest information on Events, Sales and
                      Offers.
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 text-center">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control landing-newsletter-input"
                    placeholder="Recipient's username"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                  />
                  <span
                    className="input-group-text p-0 button-newsletter-landing"
                    id="basic-addon2"
                  >
                    <button className="btn btn-light text-default">
                      Subscribe
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row w-100">
          <div className="col-lg-6 col-md-12 ">
            <h4 className="mt-2 ftw-400">Payment Partners</h4>
            <div className="row align-items-center">
              {localStorage.getItem("region") === "Bangladesh" && (
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <img
                    src={SSLCommerz}
                    className="img-fluid"
                  />
                </div>
              )}

              {localStorage.getItem("region") === "United States" && (
                <>
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <img
                      src="https://logos-world.net/wp-content/uploads/2021/03/Stripe-Logo.png"
                      width="150"
                      height="60"
                    />
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <img
                      src="https://merchantmachine.co.uk/wp-content/uploads/Authorize-net-logo.png"
                      width="150"
                      height="60"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="col-lg-6 col-md-12 ">
            <h4 className="mt-2 ftw-400">Delivery Partners</h4>
            <div className="row align-items-center">
              {localStorage.getItem("region") === "Bangladesh" && (
                <div className="col-lg-4 col-md-6 col-sm-12">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Pathao-logo.jpg"
                    width="150"
                  />
                </div>
              )}
              {localStorage.getItem("region") === "United States" && (
                <>
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <img
                      src="https://www.seekpng.com/png/detail/942-9422924_united-states-postal-service-logo-usps-png-logo.png"
                      width="150"
                      height="60"
                    />
                  </div>
                </>
              )}
              <div className="col-lg-4 col-md-6 col-sm-12">
                <img
                  src="https://logodownload.org/wp-content/uploads/2015/12/dhl-logo.png"
                  width="150"
                  height="60"
                />
              </div>
            </div>
          </div>
        </div>
        <hr />
      </div>
    </>
  );
}
