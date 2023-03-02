import { Row, Col } from "reactstrap";
import Skeleton from "@mui/material/Skeleton";
function ProductSkeleton() {
  return (
    <Row className="mt-3">
      <Col lg="3">
        <Skeleton
          variant="rectangular"
          width={210}
          height={118}
          animation="wave"
        />
        <Skeleton width={210} animation="wave" />
        <Skeleton width={210} animation="wave" />
      </Col>
      <Col lg="3">
        <Skeleton
          variant="rectangular"
          width={210}
          height={118}
          animation="wave"
        />
        <Skeleton width={210} animation="wave" />
        <Skeleton width={210} animation="wave" />
      </Col>
      <Col lg="3">
        <Skeleton
          variant="rectangular"
          width={210}
          height={118}
          animation="wave"
        />
        <Skeleton width={210} animation="wave" />
        <Skeleton width={210} animation="wave" />
      </Col>
      <Col lg="3">
        <Skeleton
          variant="rectangular"
          width={210}
          height={118}
          animation="wave"
        />
        <Skeleton width={210} animation="wave" />
        <Skeleton width={210} animation="wave" />
      </Col>
    </Row>
  );
}
export default ProductSkeleton;
