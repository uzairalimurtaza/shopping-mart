import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import { useState, useEffect } from "react";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import firetoast from "../../../../Helpers/FireToast";
import { Collapse } from "reactstrap";
// import { Menu, MenuItem, Typography } from "@material-ui/core";
// import NestedMenuItem from "material-ui-nested-menu-item";
// import { Button } from "reactstrap";
function BrowseCategories() {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
  const [isCollapsed, setCollapsed] = useState(false);
  const state = useSelector((state) => state);
  const { categoriesAndSubcategories } = state;

  const [CategoryAndSubCategory, setCategoryAndSubCategory] = useState([]);
  const [LessCategories, setLessCategories] = useState([]);
  useEffect(() => {
    if (categoriesAndSubcategories.error) {
      firetoast("Something went wrong", "default-error");
      setCategoryAndSubCategory([]);
    } else {
      var temp = categoriesAndSubcategories.categoriesAndSubCategories;

      setCategoryAndSubCategory(temp);
    }
  }, [categoriesAndSubcategories]);
  return (
    <>
      <Menu
        menuButton={
          <MenuButton
            className="btn w-100 d-flex browse-menu justify-content-between"
            onClose={() => setIsOpen(!isOpen)}
          >
            <div>
              <div>
                {" "}
                <i className="fas fa-bars" style={{ marginRight: "15px" }}></i>
                Browse Categories
              </div>
            </div>
            <div>
              {isOpen ? (
                <i className="fas fa-chevron-up"></i>
              ) : (
                <i className="fas fa-chevron-down"></i>
              )}
            </div>
          </MenuButton>
        }
      >
        {CategoryAndSubCategory.map((Category, index) =>
          index < 10 ? (
            <div key={index}>
              <SubMenu
                label={Category.CategoryDetails.Category}
                className="nav-menu-item "
                key={index}
              >
                {Category.SubCategoryDetails.map((SubCat, key) => (
                  <MenuItem
                    className="nav-submenu-item"
                    key={key}
                    onClick={() =>
                      history.push(
                        `/search-products/subcategory/${SubCat.SubCategoryID}`
                      )
                    }
                  >
                    <div
                      style={{
                        width: "100%",
                        borderBottom: "1px solid #EEEEEE",
                        margin: "5px 10px",
                        paddingBottom: "5px",
                      }}
                    >
                      {" "}
                      {SubCat.SubCategory}
                    </div>
                  </MenuItem>
                ))}
              </SubMenu>
            </div>
          ) : (
            <Collapse isOpen={isCollapsed}>
              <SubMenu
                label={Category.CategoryDetails.Category}
                className="nav-menu-item "
                key={index}
              >
                {Category.SubCategoryDetails.map((SubCat, key) => (
                  <MenuItem
                    className="nav-submenu-item"
                    key={key}
                    onClick={() =>
                      history.push(
                        `/search-products/subcategory/${SubCat.SubCategoryID}`
                      )
                    }
                  >
                    <div
                      style={{
                        width: "100%",
                        borderBottom: "1px solid #EEEEEE",
                        margin: "5px 10px",
                        paddingBottom: "5px",
                      }}
                    >
                      {" "}
                      {SubCat.SubCategory}
                    </div>
                  </MenuItem>
                ))}
              </SubMenu>
            </Collapse>
          )
        )}
        {
          <MenuItem
            className="nav-menu-item footer-category-item text-default"
            onClick={(e) => {
              e.stopPropagation = true;
              e.keepOpen = true;
              setCollapsed(!isCollapsed);
            }}
          >
            {isCollapsed ? (
              <span className="text-default">
                View Less Categories <i className="far fa-chevron-up"></i>
              </span>
            ) : (
              <span className="text-default">
                View All Categories <i className="far fa-chevron-down"></i>
              </span>
            )}
          </MenuItem>
        }
      </Menu>
      {/* <Button
        className="btn w-100 d-flex browse-menu justify-content-between"
        onClick={() => setMenuPosition(!menuPosition)}
      >
        <div>
          <div>
            {" "}
            <i className="fas fa-bars" style={{ marginRight: "15px" }}></i>
            Browse Categories
          </div>
        </div>
        <div>
          {menuPosition ? (
            <i className="fas fa-chevron-up"></i>
          ) : (
            <i className="fas fa-chevron-down"></i>
          )}
        </div>
      </Button>
      <Menu
        open={!!menuPosition}
        onClose={() => setMenuPosition(null)}
        anchorReference="anchorPosition"
        anchorPosition={menuPosition}
      >
        <MenuItem>Button 1</MenuItem>
        <MenuItem>Button 2</MenuItem>
        <NestedMenuItem label="Button 3" parentMenuOpen={!!menuPosition}>
          <MenuItem>Sub-Button 1</MenuItem>
          <MenuItem>Sub-Button 2</MenuItem>
          <NestedMenuItem
            label="Sub-Button 3"
            parentMenuOpen={!!menuPosition}
            // onClick={handleItemClick}
          >
            <MenuItem>Sub-Sub-Button 1</MenuItem>
            <MenuItem>Sub-Sub-Button 2</MenuItem>
          </NestedMenuItem>
        </NestedMenuItem>
        <MenuItem>Button 4</MenuItem>
        <NestedMenuItem
          label="Button 5"
          parentMenuOpen={!!menuPosition}
          // onClick={handleItemClick}
        >
          <MenuItem>Sub-Button 1</MenuItem>
          <MenuItem>Sub-Button 2</MenuItem>
        </NestedMenuItem>
      </Menu> */}
    </>
  );
}
export default BrowseCategories;
