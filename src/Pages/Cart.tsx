import {
  CircularProgress,
  Container,
  Divider,
  makeStyles,
  Typography,
  IconButton,
} from "@material-ui/core";
import { Add, Remove } from "@material-ui/icons";
import React from "react";
import { Link } from "react-router-dom";
import {
  CartDocument,
  CartQuery,
  useCartQuery,
  useUpdateCartMutation,
} from "../generated/graphql";

const useStyles = makeStyles(() => ({
  spinner: {
    left: "50%",
    marginLeft: "-4em",
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
}));

const Cart: React.FC = () => {
  const classes = useStyles();

  const { data, loading, error } = useCartQuery();

  const [updateCart] = useUpdateCartMutation();

  if (loading || !data) {
    return <CircularProgress className={classes.spinner} color="secondary" />;
  }

  if (error) {
    console.log(error);
    return null;
  }
  return (
    <Container>
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
              <div className={classes.addRemove}>
                <IconButton
                  size="medium"
                  onClick={async () => {
                    try {
                      await updateCart({
                        variables: {
                          cart: {
                            nos: nos - 1,
                            productId: product.id,
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
                  disabled={nos > 4}
                  size="medium"
                  onClick={async () => {
                    try {
                      await updateCart({
                        variables: {
                          cart: {
                            nos: nos + 1,
                            productId: product.id,
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
              </div>
            </div>
          </div>
          <div className={classes.divider}>
            <Divider />
          </div>
        </div>
      ))}
    </Container>
  );
};

export default Cart;
