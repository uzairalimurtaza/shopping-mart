import ADOne from "../../../../assets/images/ad1.png";
import ADTwo from "../../../../assets/images/ad22.png";
export function AdSectionOne() {
  return (
    <div className="row mt-5">
      <div className="col-6">
        <img className="img-fluid" src={ADOne} alt="first-ad" />
      </div>
      <div className="col-6">
        <img className="img-fluid" src={ADTwo} alt="second-ad" />
      </div>
    </div>
  );
}
