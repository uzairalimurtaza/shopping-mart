import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import prod1 from "../../../../assets/images/prod1.png";
import prod2 from "../../../../assets/images/prod2.png";
import prod3 from "../../../../assets/images/prod3.png";
import prod4 from "../../../../assets/images/prod4.png";
import prod5 from "../../../../assets/images/prod5.png";
function DealOfTheDay() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
  };
  return (
    <div>
      <div className="d-flex justify-content-between">
        <h4 className="ftw-400">Deal Of The Day</h4>
        <div>
          More Products{" "}
          <Link className="td-none" to="#">
            <i className="fas fa-long-arrow-alt-right text-default"></i>
          </Link>
        </div>
      </div>
      <div className="row">
        {/* <Slider {...settings}> */}
        <div className="col">
          <div className="card deal-carousel-item">
            <div className="deal-image">
              <img
                className="card-img-top deal-product-img"
                src={prod1}
                alt="Card image cap"
              />
              <div className="image-text">
                <div className="mt-2">
                  <button className="rounded-circle image-text-button">
                    {" "}
                    <i className="fas fa-shopping-cart"></i>
                  </button>
                </div>
                <div className="mt-2">
                  <button className="rounded-circle image-text-button">
                    {" "}
                    <i className="far fa-heart"></i>
                  </button>
                </div>
                <div className="mt-2">
                  <button className="rounded-circle image-text-button">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body deal-carousel-item-body">
              <h5 className="card-title ftw-400">White Valise</h5>
              <p className="card-text mb-0">
                <span className="dotd-rate">
                  <i className="fas fa-star rated"></i>
                  <i className="fas fa-star unrated"></i>
                  <i className="fas fa-star unrated"></i>
                  <i className="fas fa-star unrated"></i>
                  <i className="fas fa-star unrated"></i>{" "}
                  <span>( 0 Reviews)</span>
                </span>
              </p>
              <div>
                <span className="dotd-rate">
                  <span className="text-dark">$40.00</span>{" "}
                  <span className="price-strike">$49.99</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card deal-carousel-item">
            <div className="deal-image">
              <img
                className="card-img-top deal-product-img"
                src={prod2}
                alt="Card image cap"
              />
              <div className="image-text">
                <div className="mt-2">
                  <button className="rounded-circle image-text-button">
                    {" "}
                    <i className="fas fa-shopping-cart"></i>
                  </button>
                </div>
                <div className="mt-2">
                  <button className="rounded-circle image-text-button">
                    {" "}
                    <i className="far fa-heart"></i>
                  </button>
                </div>
                <div className="mt-2">
                  <button className="rounded-circle image-text-button">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body deal-carousel-item-body">
              <h5 className="card-title ftw-400">Brown Leather Shoes</h5>
              <p className="card-text mb-0">
                <span className="dotd-rate">
                  <i className="fas fa-star rated"></i>
                  <i className="fas fa-star rated"></i>
                  <i className="fas fa-star rated"></i>
                  <i className="fas fa-star unrated"></i>
                  <i className="fas fa-star unrated"></i>{" "}
                  <span>( 1 Reviews)</span>
                </span>
              </p>
              <div>
                <span className="dotd-rate">
                  <span className="text-dark">$75.00</span>{" "}
                  <span className="price-strike">$89.99</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card deal-carousel-item">
            <div className="deal-image">
              <img
                className="card-img-top deal-product-img"
                src={prod3}
                alt="Card image cap"
              />
              <div className="image-text">
                <div className="mt-2">
                  <button className="rounded-circle image-text-button">
                    {" "}
                    <i className="fas fa-shopping-cart"></i>
                  </button>
                </div>
                <div className="mt-2">
                  <button className="rounded-circle image-text-button">
                    {" "}
                    <i className="far fa-heart"></i>
                  </button>
                </div>
                <div className="mt-2">
                  <button className="rounded-circle image-text-button">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body deal-carousel-item-body">
              <h5 className="card-title ftw-400">Portable Flashlight</h5>
              <p className="card-text mb-0">
                <span className="dotd-rate">
                  <i className="fas fa-star rated"></i>
                  <i className="fas fa-star unrated"></i>
                  <i className="fas fa-star unrated"></i>
                  <i className="fas fa-star unrated"></i>
                  <i className="fas fa-star unrated"></i>{" "}
                  <span>( 1 Reviews)</span>
                </span>
              </p>
              <div>
                <span className="dotd-rate">
                  <span className="text-dark">$10.00</span>{" "}
                  <span className="price-strike">$11.99</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card deal-carousel-item">
            <div className="deal-image">
              <img
                className="card-img-top deal-product-img"
                src={prod4}
                alt="Card image cap"
              />
              <div className="image-text">
                <div className="mt-2">
                  <button className="rounded-circle image-text-button">
                    {" "}
                    <i className="fas fa-shopping-cart"></i>
                  </button>
                </div>
                <div className="mt-2">
                  <button className="rounded-circle image-text-button">
                    {" "}
                    <i className="far fa-heart"></i>
                  </button>
                </div>
                <div className="mt-2">
                  <button className="rounded-circle image-text-button">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body deal-carousel-item-body">
              <h5 className="card-title ftw-400">USB Charger</h5>
              <p className="card-text mb-0">
                <span className="dotd-rate">
                  <i className="fas fa-star rated"></i>
                  <i className="fas fa-star rated"></i>
                  <i className="fas fa-star rated"></i>
                  <i className="fas fa-star rated"></i>
                  <i className="fas fa-star unrated"></i>{" "}
                  <span>( 1 Reviews)</span>
                </span>
              </p>
              <div>
                <span className="dotd-rate">
                  <span className="text-dark">$10.00</span>{" "}
                  <span className="price-strike">$11.99</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="col">
          <div className="card deal-carousel-item">
            <div className="deal-image">
              <img
                className="card-img-top deal-product-img"
                src={prod4}
                alt="Card image cap"
              />
              <div className="image-text">
                <div className="mt-2">
                  <button className="rounded-circle image-text-button">
                    {" "}
                    <i className="fas fa-shopping-cart"></i>
                  </button>
                </div>
                <div className="mt-2">
                  <button className="rounded-circle image-text-button">
                    {" "}
                    <i className="far fa-heart"></i>
                  </button>
                </div>
                <div className="mt-2">
                  <button className="rounded-circle image-text-button">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body deal-carousel-item-body">
              <h5 className="card-title ftw-400">USB Charger</h5>
              <p className="card-text mb-0">
                <span className="dotd-rate">
                  <i className="fas fa-star rated"></i>
                  <i className="fas fa-star rated"></i>
                  <i className="fas fa-star rated"></i>
                  <i className="fas fa-star rated"></i>
                  <i className="fas fa-star unrated"></i> <span>( 1 Reviews)</span>
                </span>
              </p>
              <div>
                <span className="dotd-rate">
                  <span className="text-dark">$10.00</span>{" "}
                  <span className="price-strike">$11.99</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card deal-carousel-item">
            <div className="deal-image">
              <img
                className="card-img-top deal-product-img"
                src={prod5}
                alt="Card image cap"
              />
              <div className="image-text">
                <div className="mt-2">
                  <button className="rounded-circle image-text-button">
                    {" "}
                    <i className="fas fa-shopping-cart"></i>
                  </button>
                </div>
                <div className="mt-2">
                  <button className="rounded-circle image-text-button">
                    {" "}
                    <i className="far fa-heart"></i>
                  </button>
                </div>
                <div className="mt-2">
                  <button className="rounded-circle image-text-button">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body deal-carousel-item-body">
              <h5 className="card-title ftw-400">Alarm Clock</h5>
              <p className="card-text mb-0">
                <span className="dotd-rate">
                  <i className="fas fa-star rated"></i>
                  <i className="fas fa-star unrated"></i>
                  <i className="fas fa-star unrated"></i>
                  <i className="fas fa-star unrated"></i>
                  <i className="fas fa-star unrated"></i> <span>( 0 Reviews)</span>
                </span>
              </p>
              <div>
                <span className="dotd-rate">
                  <span className="text-dark">$11.00</span>{" "}
                  <span className="price-strike">$12.99</span>
                </span>
              </div>
            </div>
          </div>
        </div> */}
        {/* </Slider> */}
      </div>
    </div>
  );
}
export default DealOfTheDay;
