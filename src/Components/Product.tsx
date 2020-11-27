import {
  Breadcrumbs,
  CircularProgress,
  Container,
  Divider,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { NavigateNext } from "@material-ui/icons";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useProductQuery } from "../generated/graphql";

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
}));

const Product: React.FC = () => {
  const classes = useStyles();

  const { id } = useParams<{ id: string }>();

  const { data, loading, error } = useProductQuery({ variables: { id } });

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
            <Typography variant="body2" gutterBottom color="textSecondary">
              Brand: {data.product.brand}
            </Typography>
            <Typography color="textSecondary">Price:</Typography>
            <Typography variant="body1" color="secondary">
              {data.product.price} {data.product.currency}
            </Typography>
          </div>
          <Divider />
          <br />
          <Typography variant="h6" gutterBottom>
            About this product
          </Typography>
          <Typography variant="body2">{data.product.contents}</Typography>
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
