import {
  Breadcrumbs,
  Button,
  CircularProgress,
  Container,
  Divider,
  makeStyles,
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

const useStyles = makeStyles(() => ({
  prodContainer: {
    overflow: "auto",
    paddingTop: "10vh",
    paddingBottom: "6vh",
  },
  prodImg: {
    height: "500px",
    float: "left",
    marginRight: "50px",
  },
  breadCrumbLink: {
    color: "#8c8c8c",
  },
  title: {
    marginBottom: "30px",
  },
  breadCrumb: {
    marginBottom: "30px",
  },
  prodDivider: { clear: "both", marginTop: "30px" },
  prodFooter: {
    clear: "both",
    overflowWrap: "break-word",
  },
  spinner: {
    marginLeft: "47vw",
    marginTop: "40vh",
  },
  subTitle: {
    float: "left",
  },
  addToCart: {
    float: "right",
    marginBottom: "20px",
  },
  body: {
    clear: "inline-end",
    overflow: "auto",
  },
  buyNow: {
    float: "right",
    marginBottom: "20px",
    clear: "right",
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
      <div className={classes.breadCrumb}>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
          <Typography color="textSecondary">{cat[0]}</Typography>
          <Link
            to={`/categories/${category}`}
            className={classes.breadCrumbLink}
          >
            {cat[1]}
          </Link>
        </Breadcrumbs>
      </div>
      <div>
        <img className={classes.prodImg} src={imageUrl!} alt={id} />
        <div className={classes.title}>
          <Typography variant="h5" gutterBottom>
            {name}
          </Typography>
          <div className={classes.subTitle}>
            <Typography variant="body2" gutterBottom color="textSecondary">
              Brand: {brand}
            </Typography>
            <Typography color="textSecondary">Price:</Typography>
            <Typography variant="body1" color="secondary">
              {price} {currency}
            </Typography>
          </div>
          <div className={classes.addToCart}>
            <br />
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
          </div>
          <div className={classes.buyNow}>
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to={`/checkout?cart=false&id=${id}`}
            >
              Buy Now
            </Button>
          </div>
        </div>
        <div className={classes.body}>
          <Divider />
          <br />
          <Typography variant="h6" gutterBottom>
            About this product
          </Typography>
          <Typography variant="body2">{contents}</Typography>
        </div>
        <br />
        <Divider className={classes.prodDivider} />
      </div>
      <br />
      <div className={classes.prodFooter}>
        <Typography gutterBottom variant="subtitle2" color="primary">
          Product Description
        </Typography>
        <Typography variant="body2">{description}</Typography>
      </div>
    </Container>
  );
};

export default Product;
