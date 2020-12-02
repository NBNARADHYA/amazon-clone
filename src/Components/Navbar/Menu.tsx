import {
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useMemo, useContext } from "react";
import { ArrowBackRounded } from "@material-ui/icons";
import categories from "../../Data/productCategoriesArr.json";
import DrawerContext from "../../Context/Drawer";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useLogoutMutation } from "../../generated/graphql";
import AccessTokenContext from "../../Context/AccessToken";

const useStyles = makeStyles(() => ({
  signUpBtn: {},
  userActions: {
    marginBottom: "15px",
  },
}));

const Menu: React.FC = () => {
  const { drawerState, setDrawerState } = useContext(DrawerContext)!;
  const history = useHistory();
  const location = useLocation();
  const [logout, { loading }] = useLogoutMutation({ fetchPolicy: "no-cache" });
  const { accessToken, setAccessToken } = useContext(AccessTokenContext)!;

  const classes = useStyles();

  const pathArray = location.pathname.split("/");

  const mainCatDrawer = useMemo(
    () => (
      <div>
        <Typography
          variant="subtitle1"
          gutterBottom
          style={{ marginTop: "10px", textAlign: "center" }}
        >
          All Categories
        </Typography>
        <Divider />
        <List>
          {categories.map(({ category }, id) => (
            <ListItem key={id} button onClick={() => setDrawerState(id)}>
              <ListItemText primary={category} />
            </ListItem>
          ))}
        </List>
      </div>
    ),
    [setDrawerState]
  );

  const subCatDrawers = useMemo(
    () =>
      categories.map(({ category, subCategories }, id) => (
        <div key={id}>
          <IconButton onClick={() => setDrawerState(-1)}>
            <ArrowBackRounded />
          </IconButton>
          <Typography
            variant="subtitle1"
            gutterBottom
            style={{
              textAlign: "center",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
            color="textSecondary"
          >
            {category}
          </Typography>
          <Divider />
          <List>
            {subCategories.map((subCat) => (
              <ListItem
                key={subCat.id}
                button
                onClick={() => {
                  history.push(`/categories/${category}>${subCat.name}`);
                  setDrawerState(null);
                }}
              >
                <ListItemText primary={subCat.name} />
              </ListItem>
            ))}
          </List>
        </div>
      )),
    [setDrawerState, history]
  );

  return (
    <Drawer
      anchor="left"
      open={drawerState !== null}
      onClose={() => setDrawerState(null)}
    >
      {pathArray[1] !== "login" && pathArray[1] !== "signup" && (
        <Button
          disabled={loading}
          className={classes.signUpBtn}
          color="secondary"
          size="large"
          onClick={async () => {
            if (accessToken) {
              await logout();
              localStorage.removeItem("accessToken");
              setAccessToken(null);
            }
            setDrawerState(null);
            history.push("/login");
          }}
        >
          {accessToken ? "Logout" : "Login or signup"}
        </Button>
      )}
      {accessToken && (
        <Button
          onClick={() => setDrawerState(null)}
          component={Link}
          to="/cart"
        >
          My Cart
        </Button>
      )}
      {accessToken && (
        <Button
          onClick={() => setDrawerState(null)}
          component={Link}
          to="/orders"
        >
          My Orders
        </Button>
      )}
      <Divider />
      {drawerState === -1
        ? mainCatDrawer
        : drawerState !== null && subCatDrawers[drawerState]}
    </Drawer>
  );
};

export default Menu;
