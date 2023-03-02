// import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import { useState, useEffect } from "react";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import firetoast from "../../../../Helpers/FireToast";
import { NestedMenuItem, IconMenuItem } from 'mui-nested-menu';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { classnames } from 'classnames';
import { Collapse } from "reactstrap";
import Endpoint from './../../../../Utils/Endpoint';
function BrowseCategories2() {
    const history = useHistory();
    const [isOpen, setIsOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState(null);
    const [isCollapsed, setCollapsed] = useState(false);
    const state = useSelector((state) => state);
    const { categoriesAndSubcategories } = state;
    const [CategoryAndSubCategory, setCategoryAndSubCategory] = useState([]);
    const [LessCategories, setLessCategories] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);
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
        <div className="mb-1">
            <Button
                variant="contained"
                onClick={handleClick}
                // endIcon={<ArrowDownIcon />}
                className="browse-menu"
            >
                <div>
                    <div>
                        {" "}
                        <i className="fas fa-bars" style={{ marginRight: "15px" }}></i>
                        Browse Categories
                    </div>
                </div>
                <div style={{ marginLeft: "65px" }}>
                    {isOpen ? (
                        <i className="fas fa-chevron-up"></i>
                    ) : (
                        <i className="fas fa-chevron-down"></i>
                    )}
                </div>
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {CategoryAndSubCategory.map((Category, index) =>
                    <div className="browse-menu-item">
                        <NestedMenuItem
                            label={Category.CategoryDetails.Category}
                            parentMenuOpen={open}
                            className="nav-menu-item"
                            leftIcon={<img src={`${Endpoint}/${Category.CategoryDetails.CategoryPic}`} style={{ height: "18px", marginRight: "5px" }} />}
                        >
                            {Category.SubCategoryDetails.map((SubCat, key) => <IconMenuItem
                                onClick={() =>
                                    history.push(
                                        `/search-products/subcategory/${SubCat.SubCategoryID}`
                                    )
                                }
                                style={{
                                    width: "220px",
                                    padding: "8px 15px",
                                    margin: "0px 10px"
                                }}
                                leftIcon={<img src={`${Endpoint}/${Category.SubCategoryDetails.SubCategoryPic}`} style={{ height: "18px", marginRight: "5px" }} />}
                                label={SubCat.SubCategory}
                            />)}
                        </NestedMenuItem>
                    </div>
                )}


            </Menu>
        </div>)
}
export default BrowseCategories2;
