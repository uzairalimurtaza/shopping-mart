import { Collapse, List } from "reactstrap";
import { useState } from "react";
import { Link } from "react-router-dom";
function CategoryCollapse(props) {
  var { data } = props;
  var [CollapseOpen, setCollapseOpen] = useState(false);
  return (
    <>
      <div
        className="d-flex justify-content-between"
        style={{ alignItems: "end" }}
      >
        <div>
          <p className="mb-0">
            <b>
              <Link
                to={`/search-products/category/${data.CategoryDetails.CategoryID}`}
                className="td-none text-dark bg-white"
              >
                {data.CategoryDetails.Category}
              </Link>
            </b>
          </p>
        </div>
        <div
          onClick={() => setCollapseOpen(!CollapseOpen)}
          style={{ cursor: "pointer" }}
        >
          <i className="fas fa-chevron-down text-secondary"></i>
        </div>
      </div>
      <Collapse isOpen={CollapseOpen}>
        <List type="unstyled" className="mt-1">
          {data.SubCategoryDetails.map((item, index) => (
            <li key={index} style={{ fontSize: "15px" }}>
              <Link
                to={`/search-products/subcategory/${item.SubCategoryID}`}
                className="td-none text-dark bg-white"
              >
                {item.SubCategory}
              </Link>
            </li>
          ))}
        </List>
      </Collapse>
    </>
  );
}
export default CategoryCollapse;
