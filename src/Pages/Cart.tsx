import {
  CircularProgress,
  Container,
  Divider,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { useCartQuery } from "../generated/graphql";

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
}));

const Cart: React.FC = () => {
  const classes = useStyles();

  const { data, loading, error } = useCartQuery({
    fetchPolicy: "network-only",
  });

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
            <Typography variant="body1">
              {product.price} {product.currency}
            </Typography>
          </div>
          <div className={classes.divider}>
            {" "}
            <Divider />
          </div>
        </div>
      ))}
    </Container>
  );
};

export default Cart;
