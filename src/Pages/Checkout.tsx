import React, { useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import queryString from "query-string";
import {
  CartDocument,
  CartQuery,
  useCartQuery,
  useCreateOrderMutation,
} from "../generated/graphql";
import {
  Button,
  CircularProgress,
  Container,
  Divider,
  makeStyles,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { ErrorAlert } from "./SignUp";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles(() => ({
  formContainer: {
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
  formHeader: {
    fontSize: "35px",
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
  addRemove: {
    float: "right",
  },
  body: {
    marginTop: "30px",
  },
  nos: {
    marginLeft: "5px",
    marginRight: "5px",
    fontSize: "18px",
  },
  header: {
    marginTop: "20px",
    marginBottom: "20px",
    textAlign: "center",
  },
  spinner: {
    left: "50%",
    marginLeft: "-4em",
  },
}));

interface CheckoutFields {
  address1: string;
  address2: string;
  pincode: string;
  country: string;
  state: string;
  city: string;
}

const Checkout: React.FC<RouteComponentProps> = ({ location, history }) => {
  const classes = useStyles();
  const { data, loading, error: cartError } = useCartQuery();
  const [errOpen, setErrOpen] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const [createOrder, { error }] = useCreateOrderMutation();

  useEffect(() => {
    if (error) {
      setErrOpen(true);
    }
  }, [error]);

  if (cartError) {
    console.error(error);
    return null;
  }

  if (loading || !data) {
    return <CircularProgress className={classes.spinner} color="secondary" />;
  }

  if (success) {
    return (
      <Snackbar
        open={success}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={7000}
        onClose={() => {
          setSuccess(false);
          history.push("/");
        }}
      >
        <Alert
          onClose={() => {
            setSuccess(false);
            history.push("/");
          }}
          severity="success"
        >
          Your order was places successfully
        </Alert>
      </Snackbar>
    );
  }

  const query = queryString.parse(location.search);

  const initialValues: CheckoutFields = {
    address1: "",
    address2: "",
    pincode: "",
    country: "",
    state: "",
    city: "",
  };

  return (
    <>
      <Container className={classes.cartContainer}>
        {data.cart.map(({ nos, product }, index) => (
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
      <Container className={classes.formContainer}>
        <Formik
          initialValues={initialValues}
          validate={(values) => {
            const errors: Partial<CheckoutFields> = {};
            if (!values.address1) {
              errors.address1 = "Address required";
            }
            if (!values.pincode) {
              errors.pincode = "Pincode required";
            }
            if (!values.country) {
              errors.country = "Country required";
            }
            if (!values.state) {
              errors.state = "State required";
            }
            if (!values.city) {
              errors.city = "City required";
            }
            return errors;
          }}
          onSubmit={async (
            { address1, address2, pincode, country, state, city },
            { setSubmitting }
          ) => {
            await createOrder({
              variables: {
                data: {
                  products: data.cart.map(({ product, nos }) => ({
                    priceForOne: product.price ? product.price : "200",
                    nos,
                    product: product.id,
                  })),
                  checkout: query["cart"] === "true",
                  address: address1 + address2,
                  pincode,
                  country,
                  state,
                  city,
                },
              },
              update: (cache, { errors }) => {
                if (errors) {
                  return;
                }
                cache.writeQuery<CartQuery>({
                  query: CartDocument,
                  data: {
                    cart: [],
                  },
                });
              },
            });
            setSuccess(true);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field
                name="country"
                as={TextField}
                label="Country"
                variant="outlined"
                fullWidth
              />
              <ErrorMessage name="country" component={ErrorAlert} />
              <br />
              <br />
              <Field
                name="state"
                as={TextField}
                label="State"
                variant="outlined"
                fullWidth
              />
              <ErrorMessage name="state" component={ErrorAlert} />
              <br />
              <br />
              <Field
                name="city"
                as={TextField}
                label="City"
                variant="outlined"
                fullWidth
              />
              <ErrorMessage name="city" component={ErrorAlert} />
              <br />
              <br />
              <Field
                name="pincode"
                as={TextField}
                label="Pincode"
                variant="outlined"
                fullWidth
              />
              <ErrorMessage name="pincode" component={ErrorAlert} />
              <br />
              <br />
              <Field
                name="address1"
                as={TextField}
                label="Address Line 1"
                variant="outlined"
                fullWidth
              />
              <ErrorMessage name="address1" component={ErrorAlert} />
              <br />
              <br />
              <Field
                name="address2"
                as={TextField}
                label="Address Line 2"
                variant="outlined"
                fullWidth
              />
              <br />
              <Button
                type="submit"
                size="large"
                variant="contained"
                color="secondary"
                className={classes.submitBtn}
                disabled={isSubmitting}
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
                  {/* {error && error.message} */}
                </Alert>
              </Snackbar>
            </Form>
          )}
        </Formik>
      </Container>
    </>
  );
};

export default Checkout;
