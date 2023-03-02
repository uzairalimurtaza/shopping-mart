function RatingStars(val) {
  var count = parseInt(val);
  if (count === 0) {
    return (
      <>
        <i className="fas fa-star unrated"></i>
        <i className="fas fa-star unrated"></i>
        <i className="fas fa-star unrated"></i>
        <i className="fas fa-star unrated"></i>
        <i className="fas fa-star unrated"></i>{" "}
      </>
    );
  }
  if (count > 0 && count < 2) {
    return (
      <>
        <i className="fas fa-star rated-yellow"></i>
        <i className="fas fa-star unrated"></i>
        <i className="fas fa-star unrated"></i>
        <i className="fas fa-star unrated"></i>
        <i className="fas fa-star unrated"></i>{" "}
      </>
    );
  }
  if (count >= 2 && count < 3) {
    return (
      <>
        <i className="fas fa-star rated-yellow"></i>
        <i className="fas fa-star rated-yellow"></i>
        <i className="fas fa-star unrated"></i>
        <i className="fas fa-star unrated"></i>
        <i className="fas fa-star unrated"></i>{" "}
      </>
    );
  }
  if (count >= 3 && count < 4) {
    return (
      <>
        <i className="fas fa-star rated-yellow"></i>
        <i className="fas fa-star rated-yellow"></i>
        <i className="fas fa-star rated-yellow"></i>
        <i className="fas fa-star unrated"></i>
        <i className="fas fa-star unrated"></i>{" "}
      </>
    );
  }
  if (count >= 4 && count < 5) {
    return (
      <>
        <i className="fas fa-star rated-yellow"></i>
        <i className="fas fa-star rated-yellow"></i>
        <i className="fas fa-star rated-yellow"></i>
        <i className="fas fa-star rated-yellow"></i>
        <i className="fas fa-star unrated"></i>{" "}
      </>
    );
  }

  if (count >= 5) {
    return (
      <>
        <i className="fas fa-star rated-yellow"></i>
        <i className="fas fa-star rated-yellow"></i>
        <i className="fas fa-star rated-yellow"></i>
        <i className="fas fa-star rated-yellow"></i>
        <i className="fas fa-star rated-yellow"></i>{" "}
      </>
    );
  }
}
export default RatingStars;
