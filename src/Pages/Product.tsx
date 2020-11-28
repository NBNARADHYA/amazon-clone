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
import React, { useContext } from "react";
import { Link, RouteComponentProps, useParams } from "react-router-dom";
import AccessTokenContext from "../Context/AccessToken";
import CartContext from "../Context/Cart";
import { useAddToCartMutation, useProductQuery } from "../generated/graphql";

const useStyles = makeStyles(() => ({
  prodContainer: {
    overflow: "auto",
    marginTop: "50px",
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
    left: "50%",
    marginLeft: "-4em",
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
}));

const Product: React.FC<RouteComponentProps> = ({ history }) => {
  const classes = useStyles();

  const { id } = useParams<{ id: string }>();

  const { cart, setCart } = useContext(CartContext)!;
  const { accessToken } = useContext(AccessTokenContext)!;

  const { data, loading, error } = useProductQuery({ variables: { id } });

  const [addToCart] = useAddToCartMutation();

  if (error) {
    console.log(error);
  }

  if (loading) {
    return <CircularProgress color="secondary" className={classes.spinner} />;
  }

  if (data) {
    const cat = data.product.category.split(">");

    if (!data.product.price) {
      data.product.price = "200";
    }

    return (
      <Container className={classes.prodContainer}>
        <div className={classes.breadCrumb}>
          <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
            <Typography color="textSecondary">{cat[0]}</Typography>
            <Link
              to={`/categories/${data.product.category}`}
              className={classes.breadCrumbLink}
            >
              {cat[1]}
            </Link>
          </Breadcrumbs>
        </div>
        <div>
          <img
            className={classes.prodImg}
            src={data.product.imageUrl!}
            alt={data.product.id}
          />
          <div className={classes.title}>
            <Typography variant="h5" gutterBottom>
              {data.product.name}
            </Typography>
            <div className={classes.subTitle}>
              <Typography variant="body2" gutterBottom color="textSecondary">
                Brand: {data.product.brand}
              </Typography>
              <Typography color="textSecondary">Price:</Typography>
              <Typography variant="body1" color="secondary">
                {data.product.price} {data.product.currency}
              </Typography>
            </div>
            <div className={classes.addToCart}>
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                  if (!accessToken) {
                    history.push("/login");
                    return;
                  }
                  if (cart[data.product.id]) return;
                  try {
                    await addToCart({
                      variables: {
                        cart: {
                          productId: data.product.id,
                          priceForOne: data.product.price!,
                        },
                      },
                    });
                    setCart((prev) => {
                      const newCart = { ...prev };
                      newCart[data.product.id] = true;
                      return newCart;
                    });
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                {!accessToken
                  ? "Login to add to cart"
                  : !cart[data.product.id]
                  ? "Add to Cart"
                  : "Checkout cart"}
              </Button>
            </div>
          </div>
          <div className={classes.body}>
            <Divider />
            <br />
            <Typography variant="h6" gutterBottom>
              About this product
            </Typography>
            <Typography variant="body2">{data.product.contents}</Typography>
          </div>
          <br />
          <Divider className={classes.prodDivider} />
        </div>
        <br />
        <div className={classes.prodFooter}>
          <Typography gutterBottom variant="subtitle2" color="primary">
            Product Description
          </Typography>
          <Typography variant="body2">{data.product.description}</Typography>
        </div>
      </Container>
    );
  }

  return <div>Error...</div>;
};

export default Product;
