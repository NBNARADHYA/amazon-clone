import {
  Breadcrumbs,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import { NavigateNext } from "@material-ui/icons";
import React, { useContext, useEffect, useMemo } from "react";
import { Link, RouteComponentProps, useParams } from "react-router-dom";
import AccessTokenContext from "../Context/AccessToken";
import {
  CartDocument,
  CartQuery,
  useAddToCartMutation,
  useCartLazyQuery,
  useProductQuery,
} from "../generated/graphql";

const useStyles = makeStyles((theme: Theme) => ({
  prodContainer: {
    paddingTop: "10vh",
    paddingBottom: "6vh",
  },
  prodImg: {
    [theme.breakpoints.up("lg")]: {
      width: "85%",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      width: "60%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "85%",
    },
  },
  breadCrumbLink: {
    color: "#8c8c8c",
  },
  breadCrumb: {
    paddingBottom: "10%",
  },
  spinner: {
    marginLeft: "47vw",
    marginTop: "40vh",
  },
  divider: {
    marginTop: 5,
    marginBottom: 15,
  },
}));

const Product: React.FC<RouteComponentProps> = ({ history }) => {
  const classes = useStyles();
  const { id: productId } = useParams<{ id: string }>();

  const [loadCart, cart] = useCartLazyQuery();
  const product = useProductQuery({ variables: { id: productId } });
  const [addToCart, { loading }] = useAddToCartMutation();

  const { accessToken } = useContext(AccessTokenContext)!;
  useEffect(() => {
    if (accessToken) {
      loadCart();
    }
  }, [loadCart, accessToken]);

  const isPresentInCart = useMemo<boolean | null | undefined>(() => {
    if (product.data && cart.data) {
      return Boolean(
        cart.data.cart.find(
          (ele) => ele.product.id === product.data!.product.id
        )
      );
    }
  }, [product.data, cart.data]);

  if (product.error) {
    console.error(product.error);
    return null;
  }

  if (
    product.loading ||
    !product.data ||
    (accessToken && (cart.loading || !cart.data))
  ) {
    return <CircularProgress color="inherit" className={classes.spinner} />;
  }

  if (!product.data.product.price) {
    product.data.product.price = "200";
  }
  const {
    id,
    category,
    currency,
    imageUrl,
    brand,
    name,
    contents,
    price,
    description,
  } = product.data.product;

  const cat = category.split(">");

  return (
    <Container className={classes.prodContainer}>
      <Grid container spacing={3} direction="column">
        <Grid item xs={12} className={classes.breadCrumb}>
          <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
            <Typography color="textSecondary">{cat[0]}</Typography>
            <Link
              to={`/categories/${category}`}
              className={classes.breadCrumbLink}
            >
              {cat[1]}
            </Link>
          </Breadcrumbs>
        </Grid>
        <Grid container item spacing={1}>
          <Grid item xs={12} lg={6}>
            <img className={classes.prodImg} src={imageUrl!} alt={id} />
          </Grid>
          <Grid item container direction="column" spacing={2} xs={12} lg={6}>
            <Grid item>
              <Typography variant="h5" gutterBottom>
                {name}
              </Typography>
            </Grid>
            <Grid item container spacing={2}>
              <Grid
                item
                container
                direction="column"
                spacing={1}
                xs={4}
                sm={6}
                lg={4}
              >
                <Grid item>
                  <Typography
                    variant="body2"
                    gutterBottom
                    color="textSecondary"
                  >
                    Brand: {brand}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography color="textSecondary">Price:</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1" color="secondary">
                    {price} {currency}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                item
                container
                direction="column"
                alignItems="flex-end"
                spacing={2}
                xs={8}
                sm={6}
                lg={8}
              >
                <Grid item>
                  <Button
                    disabled={loading}
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                      if (!accessToken) {
                        history.push("/login");
                        return;
                      }
                      if (isPresentInCart) {
                        history.push("/checkout?cart=true");
                        return;
                      }
                      try {
                        await addToCart({
                          variables: {
                            cart: {
                              product: id,
                            },
                          },
                          update: (cache, { data, errors }) => {
                            if (errors) {
                              return;
                            }
                            cache.writeQuery<CartQuery>({
                              query: CartDocument,
                              data: {
                                cart: [
                                  ...cart.data!.cart,
                                  {
                                    nos: data!.addToCart.nos!,
                                    product: {
                                      id,
                                      name,
                                      currency,
                                      imageUrl,
                                      price,
                                    },
                                  },
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
                    {!accessToken
                      ? "Login to add to cart"
                      : !isPresentInCart
                      ? "Add to Cart"
                      : "Checkout cart"}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    component={Link}
                    to={`/checkout?cart=false&id=${id}`}
                  >
                    Buy Now
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Divider className={classes.divider} />
              <Typography variant="h6" gutterBottom>
                About this product
              </Typography>
              <Typography variant="body2">{contents}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
        <Grid item xs={12}>
          <Typography gutterBottom variant="subtitle2" color="primary">
            Product Description
          </Typography>
          <Typography variant="body2">{description}</Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Product;
