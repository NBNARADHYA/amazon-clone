import {
  CircularProgress,
  Container,
  Divider,
  makeStyles,
  Typography,
  IconButton,
  Button,
  Grid,
  Theme,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { Add, Remove } from "@material-ui/icons";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import DrawerContext from "../Context/Drawer";
import {
  CartDocument,
  CartQuery,
  useCartQuery,
  useUpdateCartMutation,
} from "../generated/graphql";

const useStyles = makeStyles((theme: Theme) => ({
  spinner: {
    marginLeft: "47vw",
    marginTop: "40vh",
  },
  productImg: {
    [theme.breakpoints.down("sm")]: {
      width: "40%",
    },
    [theme.breakpoints.between("sm", "md")]: {
      width: "50%",
    },
    [theme.breakpoints.up("lg")]: {
      width: "55%",
    },
  },
  link: {
    textDecoration: "none",
  },
  divider: {
    [theme.breakpoints.down("sm")]: {
      paddingTop: "6%",
      paddingBottom: "12%",
    },
    [theme.breakpoints.between("sm", "md")]: {
      paddingTop: "4%",
      paddingBottom: "8%",
    },
    [theme.breakpoints.up("lg")]: {
      paddingTop: "2%",
      paddingBottom: "4%",
    },
  },
  nos: {
    marginLeft: "5px",
    marginRight: "5px",
    fontSize: "18px",
  },
  header: {
    textAlign: "center",
  },
  checkoutBtn: {
    textAlign: "center",
  },
  emptyCartHeader: {
    paddingTop: "15%",
    textAlign: "center",
  },
  outerDiv: {
    paddingTop: "7vh",
    paddingBottom: "6vh",
  },
}));

const Cart: React.FC = () => {
  const classes = useStyles();

  const { data, loading, error } = useCartQuery();

  const [updateCart, { loading: updateLoading }] = useUpdateCartMutation();
  const { setDrawerState } = useContext(DrawerContext)!;

  const theme = useTheme();
  const isSmOrXs = useMediaQuery(theme.breakpoints.down("md"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));

  if (loading || !data) {
    return <CircularProgress className={classes.spinner} color="inherit" />;
  }

  if (error) {
    console.error(error);
    return null;
  }

  if (!data.cart.length) {
    return (
      <Container className={classes.outerDiv}>
        <Typography
          variant={isSmOrXs ? "h4" : isMd ? "h3" : "h2"}
          color="secondary"
          gutterBottom
          className={classes.emptyCartHeader}
        >
          Your Cart is empty !
        </Typography>
        <div style={{ textAlign: "center" }}>
          <Button
            variant="contained"
            style={{ marginTop: "100px" }}
            onClick={() => setDrawerState(-1)}
          >
            <Typography
              variant={isSmOrXs ? "h5" : isMd ? "h4" : "h3"}
              color="textSecondary"
            >
              All Categories
            </Typography>
          </Button>
        </div>
      </Container>
    );
  }
  return (
    <Container className={classes.outerDiv}>
      <Grid container spacing={1} className={classes.divider}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            color="secondary"
            gutterBottom
            className={classes.header}
          >
            My Cart
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>
      <Grid container spacing={2} direction="column">
        {data.cart.map(({ nos, product }, index) => (
          <Grid item container spacing={3} key={index}>
            <Grid item xs={12} sm={6} md={4}>
              <img
                src={product.imageUrl!}
                alt={product.name}
                className={classes.productImg}
              />
            </Grid>
            <Grid
              item
              container
              spacing={1}
              xs={12}
              sm={6}
              md={8}
              direction="column"
            >
              <Grid item>
                <Typography
                  variant="body1"
                  component={Link}
                  to={`/products/${product.id}`}
                  className={classes.link}
                >
                  {product.name}
                </Typography>
              </Grid>
              <Grid item container spacing={1} justify="space-evenly">
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {product.price} {product.currency}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <IconButton
                    size="medium"
                    disabled={updateLoading}
                    onClick={async () => {
                      try {
                        await updateCart({
                          variables: {
                            cart: {
                              nos: nos - 1,
                              product: product.id,
                            },
                          },
                          update: (cache, updateCartData) => {
                            if (updateCartData.errors) {
                              return;
                            }
                            const cartIdx = data.cart.findIndex(
                              (ele) => ele.product.id === product.id
                            );

                            let newCart = [...data.cart.slice(0, cartIdx)];
                            if (nos > 1) {
                              const newCartProd = {
                                ...data.cart[cartIdx],
                                nos: nos - 1,
                              };
                              newCart = [...newCart, newCartProd];
                            }
                            newCart = [
                              ...newCart,
                              ...data.cart.slice(cartIdx + 1),
                            ];

                            cache.writeQuery<CartQuery>({
                              query: CartDocument,
                              data: {
                                cart: newCart,
                              },
                            });
                          },
                        });
                      } catch (error) {
                        console.error(error);
                      }
                    }}
                  >
                    <Remove color="secondary" />
                  </IconButton>
                  <Typography
                    variant="button"
                    color="primary"
                    className={classes.nos}
                  >
                    {nos}
                  </Typography>
                  <IconButton
                    disabled={nos > 4 || updateLoading}
                    size="medium"
                    onClick={async () => {
                      try {
                        await updateCart({
                          variables: {
                            cart: {
                              nos: nos + 1,
                              product: product.id,
                            },
                          },
                          update: (cache, updateCartData) => {
                            if (updateCartData.errors) {
                              return;
                            }
                            const cartIdx = data.cart.findIndex(
                              (ele) => ele.product.id === product.id
                            );
                            const newCartProd = {
                              ...data.cart[cartIdx],
                              nos: nos + 1,
                            };
                            cache.writeQuery<CartQuery>({
                              query: CartDocument,
                              data: {
                                cart: [
                                  ...data.cart.slice(0, cartIdx),
                                  newCartProd,
                                  ...data.cart.slice(cartIdx + 1),
                                ],
                              },
                            });
                          },
                        });
                      } catch (error) {
                        console.error(error);
                      }
                    }}
                  >
                    <Add color="secondary" />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} className={classes.divider}>
              <Divider />
            </Grid>
          </Grid>
        ))}
      </Grid>
      <br />
      <div className={classes.checkoutBtn}>
        <Button
          component={Link}
          to="/checkout?cart=true"
          color="secondary"
          size="large"
          variant="contained"
        >
          Checkout Cart
        </Button>
      </div>
    </Container>
  );
};

export default Cart;
