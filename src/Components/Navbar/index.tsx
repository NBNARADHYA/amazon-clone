import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  IconButton,
  InputBase,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { fade, makeStyles, useTheme } from "@material-ui/core/styles";
import {
  MenuRounded as MenuIcon,
  SearchRounded as SearchIcon,
} from "@material-ui/icons";
import DrawerContext from "../../Context/Drawer";
import SearchInCategoryContext from "../../Context/SearchInCategory";
import Menu from "./Menu";
import { Link, useLocation } from "react-router-dom";
import AccessTokenContext from "../../Context/AccessToken";
import CartIcon from "@material-ui/icons/ShoppingCartSharp";

const useStyles = makeStyles((theme) => ({
  appBar: {
    marginBottom: "5px",
    backgroundColor: "#333333",
  },
  menuIcon: {
    marginRight: "1vw",
    color: "#e6e6e6",
  },
  search: {
    width: "80%",
    color: "#333333",
    marginLeft: "5vw",
    height: "35px",
    paddingLeft: "1vw",
    paddingTop: "1.8px",
    marginRight: "0.5vw",
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
    width: "70vw",
  },
  cart: {
    color: "white",
    fontSize: "large",
    position: "absolute",
    right: "1vw",
  },
}));

const Navbar: React.FC = () => {
  const { setDrawerState } = useContext(DrawerContext)!;
  const { accessToken, setAccessToken } = useContext(AccessTokenContext)!;
  const { setSearchInCatString } = useContext(SearchInCategoryContext)!;

  const [searchString, setSearchString] = useState("");
  const classes = useStyles();
  const theme = useTheme();
  const isLgOrXl = useMediaQuery(theme.breakpoints.up("md"));

  const location = useLocation();

  useEffect(() => {
    const localAccessToken = localStorage.getItem("accessToken");
    if (localAccessToken !== accessToken) {
      setAccessToken(localAccessToken);
    }
  });

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
      <Menu catPlaceHolder={catPlaceHolder} />
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
        {isLgOrXl && (
          <>
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
            {accessToken && (
              <IconButton className={classes.cart} component={Link} to="/cart">
                <CartIcon />
              </IconButton>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
