import prod1 from "../../../../assets/images/blog1.png";
import prod2 from "../../../../assets/images/blog2.png";
import prod3 from "../../../../assets/images/blog3.png";
import prod4 from "../../../../assets/images/blog4.png";
import { Link } from "react-router-dom";
export function Blogs() {
  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between">
        <h4 className="ftw-400">From Our Blogs</h4>
        <div>
          View All Blogs{" "}
          <Link className="td-none" to="#">
            <i className="fas fa-long-arrow-alt-right text-default"></i>
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-3 col-md-6 col-sm-12">
          <div className="card deal-carousel-item">
            <img
              className="card-img-top deal-product-img"
              src={prod1}
              alt="Card image cap"
            />

            <div className="card-body ">
              <p style={{ fontSize: "14px" }}>Sept 28,2021</p>
              <h6 className="card-title ftw-400">
                Aliquam tincidunt mauris eurisus aliquam tincidunt
              </h6>

              <p style={{ fontSize: "14px" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore.
              </p>
              <div>
                <button className="btn btn-default-outline">Read More</button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12">
          <div className="card deal-carousel-item">
            <img
              className="card-img-top deal-product-img"
              src={prod2}
              alt="Card image cap"
            />

            <div className="card-body ">
              <p style={{ fontSize: "14px" }}>Sept 28,2021</p>
              <h6 className="card-title ftw-400">
                Aliquam tincidunt mauris eurisus aliquam tincidunt
              </h6>

              <p style={{ fontSize: "14px" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore.
              </p>
              <div>
                <button className="btn btn-default-outline">Read More</button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12">
          <div className="card deal-carousel-item">
            <img
              className="card-img-top deal-product-img"
              src={prod3}
              alt="Card image cap"
            />
            <div className="card-body ">
              <p style={{ fontSize: "14px" }}>Sept 28,2021</p>
              <h6 className="card-title ftw-400">
                Aliquam tincidunt mauris eurisus aliquam tincidunt
              </h6>

              <p style={{ fontSize: "14px" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore.
              </p>
              <div>
                <button className="btn btn-default-outline">Read More</button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12">
          <div className="card deal-carousel-item">
            <img
              className="card-img-top deal-product-img"
              src={prod4}
              alt="Card image cap"
            />
            <div className="card-body ">
              <p style={{ fontSize: "14px" }}>Sept 28,2021</p>
              <h6 className="card-title ftw-400">
                Aliquam tincidunt mauris eurisus aliquam tincidunt
              </h6>

              <p style={{ fontSize: "14px" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore.
              </p>
              <div>
                <button className="btn btn-default-outline">Read More</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
