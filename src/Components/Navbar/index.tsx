import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  IconButton,
  InputBase,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import {
  MenuRounded as MenuIcon,
  SearchRounded as SearchIcon,
} from "@material-ui/icons";
import categories from "../../Data/productSubCategories.json";
import DrawerContext from "../../Context/Drawer";
import SearchInCategoryContext from "../../Context/SearchInCategory";
import CategoriesDrawer from "./CategoriesDrawer";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  appBar: {
    marginBottom: "5px",
    backgroundColor: "#333333",
  },
  menuIcon: {
    marginRight: "20px",
    color: "#e6e6e6",
  },
  search: {
    width: "80%",
    color: "#333333",
    marginLeft: "100px",
    height: "35px",
    paddingLeft: "10px",
    paddingTop: "2px",
    marginRight: "3px",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.7),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.8),
    },
  },
  searchBtn: {
    color: "white",
    fontSize: "large",
  },
  title: {
    textDecoration: "none",
    color: "#e6e6e6",
  },
  searchForm: {
    width: "70%",
  },
}));

const Navbar: React.FC = () => {
  const { setDrawerState } = useContext(DrawerContext)!;
  const { setSearchInCatString } = useContext(SearchInCategoryContext)!;

  const [searchString, setSearchString] = useState("");
  const classes = useStyles();

  const path: string = "/ad/";

  const pathArray = path.split("/");

  const catPlaceHolder =
    pathArray.length === 3 && pathArray[1] === "categories"
      ? categories[Number(pathArray[2])]
      : "All products";

  useEffect(() => {
    setSearchInCatString("");
    setSearchString("");
  }, [path, setSearchInCatString]);

  return (
    <AppBar className={classes.appBar}>
      <CategoriesDrawer />
      <Toolbar>
        <IconButton edge="start" onClick={() => setDrawerState(-1)}>
          <MenuIcon className={classes.menuIcon} />
        </IconButton>
        <Typography
          variant="h5"
          component={Link}
          to="/"
          className={classes.title}
        >
          Amazon Clone
        </Typography>
        <form
          className={classes.searchForm}
          onSubmit={(e) => {
            e.preventDefault();
            setSearchInCatString(searchString);
          }}
        >
          <InputBase
            fullWidth
            className={classes.search}
            placeholder={`Search ${catPlaceHolder}`}
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
          <IconButton className={classes.searchBtn} type="submit">
            <SearchIcon />
          </IconButton>
        </form>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
