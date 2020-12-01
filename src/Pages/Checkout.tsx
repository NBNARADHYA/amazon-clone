import React, { useEffect, useMemo, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import queryString from "query-string";
import {
  CartDocument,
  CartQuery,
  OrderContent,
  OrdersDocument,
  OrdersQuery,
  Product,
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

type OrdersQueryProductsType = Array<
  { __typename?: "OrderContent" } & Pick<OrderContent, "nos"> & {
      product: { __typename?: "Product" } & Pick<
        Product,
        "id" | "name" | "price" | "currency" | "imageUrl"
      >;
    }
>;

const Checkout: React.FC<RouteComponentProps> = ({ location, history }) => {
  const query = useMemo(() => queryString.parse(location.search), [
    location.search,
  ]);

  if (query["cart"] !== "true" && query["cart"] !== "false") {
    history.push("/");
  }
  const classes = useStyles();
  const [cartQuery, { data, loading, error: cartError }] = useCartLazyQuery();
  const [
    productQuery,
    { data: prodData, loading: prodLoading, error: prodError },
  ] = useProductLazyQuery();
  const [errOpen, setErrOpen] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const [createOrder, { error }] = useCreateOrderMutation();

  useEffect(() => {
    if (error) {
      setErrOpen(true);
    }
  }, [error]);

  useEffect(() => {
    if (query["cart"] === "true") {
      cartQuery();
    } else {
      productQuery({
        variables: {
          id: query["id"] as string,
        },
      });
    }
  }, [cartQuery, query, productQuery]);

  if (cartError || prodError) {
    console.error(error);
    return null;
  }

  if (
    (query["cart"] === "true" && (loading || !data)) ||
    (query["cart"] === "false" && (prodLoading || !prodData))
  ) {
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

  const initialValues: CheckoutFields = {
    address1: "",
    address2: "",
    pincode: "",
    country: "",
    state: "",
    city: "",
  };

  const currData =
    query["cart"] === "true"
      ? data!.cart
      : [
          {
            nos: 1,
            product: {
              imageUrl: prodData!.product.imageUrl,
              name: prodData!.product.name,
              id: prodData!.product.id,
              price: prodData!.product.price,
              currency: prodData!.product.currency,
            },
          },
        ];

  return (
    <>
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
            let products: {
              nos: number;
              product: string;
            }[];
            if (query["cart"] === "false") {
              if (!query["id"]) return;
              products = [
                {
                  nos: 1,
                  product: query["id"] as string,
                },
              ];
            } else {
              products = data!.cart.map(({ product, nos }) => ({
                nos,
                product: product.id,
              }));
            }
            await createOrder({
              variables: {
                data: {
                  products,
                  checkout: query["cart"] === "true",
                  address: address1 + address2,
                  pincode,
                  country,
                  state,
                  city,
                },
              },
              update: (cache, { errors, data: createOrderData }) => {
                if (errors || !createOrderData) {
                  return;
                }
                if (query["cart"] === "true") {
                  cache.writeQuery<CartQuery>({
                    query: CartDocument,
                    data: {
                      cart: [],
                    },
                  });
                }

                try {
                  const currOrdersData = cache.readQuery<OrdersQuery>({
                    query: OrdersDocument,
                  });
                  cache.writeQuery<OrdersQuery>({
                    query: OrdersDocument,
                    data: {
                      orders: [
                        ...currOrdersData!.orders,
                        {
                          address: address1 + address2,
                          pincode,
                          country,
                          state,
                          city,
                          createdAt: createOrderData.createOrder.createdAt,
                          id: createOrderData.createOrder.id,
                          products: currData as OrdersQueryProductsType,
                        },
                      ],
                    },
                  });
                } catch (error) {}
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
                  {error && error.message}
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
