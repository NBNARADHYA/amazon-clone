import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Button,
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
import DrawerContext from "../../Context/Drawer";
import SearchInCategoryContext from "../../Context/SearchInCategory";
import CategoriesDrawer from "./CategoriesDrawer";
import { Link, useLocation } from "react-router-dom";

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
  signUpBtn: {
    marginLeft: "240px",
  },
}));

const Navbar: React.FC = () => {
  const { setDrawerState } = useContext(DrawerContext)!;
  const { setSearchInCatString } = useContext(SearchInCategoryContext)!;

  const [searchString, setSearchString] = useState("");
  const classes = useStyles();

  const location = useLocation();

  const pathArray = location.pathname.split("/");

  const catPlaceHolder =
    pathArray.length === 3 && pathArray[1] === "categories"
      ? pathArray[2].split(">")[1]
      : "All products";

  useEffect(() => {
    setSearchInCatString("");
    setSearchString("");
  }, [setSearchInCatString]);

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
            onChange={(e) => {
              setSearchString(e.target.value);
              if (e.target.value === "") {
                setSearchInCatString("");
              }
            }}
          />
          <IconButton className={classes.searchBtn} type="submit">
            <SearchIcon />
          </IconButton>
        </form>
        <Button
          to="/signup"
          component={Link}
          color="inherit"
          className={classes.signUpBtn}
          size="large"
        >
          SignUp
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
