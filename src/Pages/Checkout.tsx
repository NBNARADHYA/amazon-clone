import React, { useEffect, useMemo, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import queryString from "query-string";
import {
  useCartLazyQuery,
  useCreateOrderMutation,
  useProductLazyQuery,
} from "../generated/graphql";
import {
  Button,
  CircularProgress,
  Divider,
  Grid,
  makeStyles,
  Snackbar,
  Theme,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { loadStripe } from "@stripe/stripe-js";

const useStyles = makeStyles((theme: Theme) => ({
  submitBtn: {
    width: "40%",
    fontSize: "100%",
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
  spinner: {
    marginLeft: "47vw",
    marginTop: "40vh",
  },
  outerDiv: {
    paddingTop: "10vh",
    paddingBottom: "6vh",
  },
}));

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE!);

const Checkout: React.FC<RouteComponentProps> = ({ location, history }) => {
  const query = useMemo(() => queryString.parse(location.search), [
    location.search,
  ]);
  const isCart = query["cart"] === "true";
  if (query["cart"] !== "true" && query["cart"] !== "false") {
    history.push("/");
  }

  const classes = useStyles();

  const [cartQuery, cart] = useCartLazyQuery();
  const [productQuery, product] = useProductLazyQuery();
  const [createOrder, { error, loading }] = useCreateOrderMutation();

  const [displayError, setDisplayError] = useState<null | {
    [key: string]: any;
  }>(null);

  const [errOpen, setErrOpen] = useState<boolean>(false);

  useEffect(() => {
    if (error) {
      setDisplayError(error);
      setErrOpen(true);
    }
  }, [error]);

  useEffect(() => {
    if (isCart) {
      cartQuery();
    } else {
      productQuery({
        variables: {
          id: query["id"] as string,
        },
      });
    }
  }, [cartQuery, query, productQuery, isCart]);

  if (cart.error) {
    console.error(cart.error);
    return null;
  }
  if (product.error) {
    console.error(product.error);
    return null;
  }
  if (
    (isCart && (cart.loading || !cart.data)) ||
    (!isCart && (product.loading || !product.data))
  ) {
    return <CircularProgress className={classes.spinner} color="inherit" />;
  }

  const currData = isCart
    ? cart.data!.cart
    : [
        {
          nos: 1,
          product: {
            imageUrl: product.data!.product.imageUrl,
            name: product.data!.product.name,
            id: product.data!.product.id,
            price: product.data!.product.price,
            currency: product.data!.product.currency,
          },
        },
      ];

  return (
    <Grid
      container
      spacing={3}
      className={classes.outerDiv}
      justify="space-evenly"
    >
      <Grid item container xs={12} lg={8} direction="column" spacing={2}>
        {currData!.map(({ nos, product }, index) => (
          <Grid container item key={index}>
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
              <Grid item>
                <Typography variant="body1">
                  {product.price} {product.currency}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} className={classes.divider}>
              <Divider />
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Grid item xs={12} lg={4}>
        <Button
          onClick={async () => {
            let products: {
              nos: number;
              product: string;
            }[];
            if (!isCart) {
              if (!query["id"]) return;
              products = [
                {
                  nos: 1,
                  product: query["id"] as string,
                },
              ];
            } else {
              products = cart.data!.cart.map(({ product, nos }) => ({
                nos,
                product: product.id,
              }));
            }
            const result = await createOrder({
              variables: {
                data: {
                  products,
                  checkout: isCart,
                },
              },
            });
            if (result.errors) {
              setDisplayError(result.errors);
            }
            const stripe = await stripePromise;
            const stripeRedirect = await stripe!.redirectToCheckout({
              sessionId: result.data?.createOrder.stripeId!,
            });
            if (stripeRedirect?.error) {
              setDisplayError(stripeRedirect.error);
            }
          }}
          size="large"
          variant="contained"
          color="secondary"
          className={classes.submitBtn}
          disabled={loading}
        >
          Place Order
        </Button>
        <Snackbar
          open={errOpen}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          autoHideDuration={6000}
          onClose={() => setErrOpen(false)}
        >
          <Alert onClose={() => setErrOpen(false)} severity="error">
            {displayError && displayError.message}
          </Alert>
        </Snackbar>
      </Grid>
    </Grid>
  );
};

export default Checkout;
