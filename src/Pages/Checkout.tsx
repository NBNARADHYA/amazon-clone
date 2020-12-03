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
  Container,
  Divider,
  makeStyles,
  Snackbar,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { loadStripe } from "@stripe/stripe-js";

const useStyles = makeStyles(() => ({
  checkoutBtn: {
    textAlign: "center",
    width: "28%",
    paddingBottom: "50px",
    paddingTop: "60px",
    float: "right",
    marginRight: "5%",
  },
  cartContainer: {
    textAlign: "center",
    width: "60%",
    paddingBottom: "50px",
    paddingTop: "60px",
    float: "left",
  },
  submitBtn: {
    width: "200px",
    fontSize: "20px",
    marginTop: "20px",
  },
  productImg: {
    height: "165px",
    float: "left",
    marginRight: "50px",
  },
  link: {
    textDecoration: "none",
  },
  productDiv: {
    overflow: "auto",
    marginTop: "20px",
  },
  divider: {
    marginTop: "10px",
    marginBottom: "20px",
  },
  price: {
    float: "left",
  },
  body: {
    marginTop: "30px",
  },
  spinner: {
    marginLeft: "47vw",
    marginTop: "40vh",
  },
  outerDiv: {
    paddingTop: "7vh",
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
    <div className={classes.outerDiv}>
      <Container className={classes.cartContainer}>
        {currData!.map(({ nos, product }, index) => (
          <div key={index}>
            <div className={classes.productDiv}>
              <img
                src={product.imageUrl!}
                alt={product.name}
                className={classes.productImg}
              />
              <Typography
                variant="body1"
                component={Link}
                to={`/products/${product.id}`}
                className={classes.link}
              >
                {product.name}
              </Typography>
              <div className={classes.body}>
                <Typography variant="body1" className={classes.price}>
                  {product.price} {product.currency}
                </Typography>
              </div>
            </div>
            <div className={classes.divider}>
              <Divider />
            </div>
          </div>
        ))}
      </Container>
      <Container className={classes.checkoutBtn}>
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
      </Container>
    </div>
  );
};

export default Checkout;
