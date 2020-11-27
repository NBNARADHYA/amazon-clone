import {
  Divider,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useProductsQuery } from "../generated/graphql";

const useStyles = makeStyles(() => ({
  pagination: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "10px",
    position: "absolute",
    bottom: "6vh",
    marginTop: 20,
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
  formControl: {
    minWidth: "120px",
    marginBottom: "20px",
    marginLeft: "20px",
  },
  spinner: {
    left: "50%",
    marginLeft: "-4em",
  },
}));

const Category: React.FC = () => {
  const classes = useStyles();

  const { category } = useParams<{ category: string }>();

  const [page, setPage] = useState(1);
  const [order, setOrder] = useState<number | null>(null);

  const { data, loading, error } = useProductsQuery({
    variables: { category, order, skip: 20 * (page - 1), take: 20 },
  });

  useEffect(() => {
    setPage(1);
  }, [category]);

  if (error) {
    console.log(error);
  }

  if (loading) {
    return <CircularProgress color="secondary" className={classes.spinner} />;
  }

  // const [sortedProducts, setSortedProducts] = useState(products)

  // const { searchInCatString } = useContext(SearchInCategoryContext)!;

  // useEffect(() => {
  //   if (sortBy !== "") {
  //     setSortedProducts(
  //       products.slice().sort((a, b) => {
  //         const priceOfA: number = +a.product_price
  //         const priceOfB: number = +b.product_price

  //         return sortBy === 1 ? priceOfA - priceOfB : priceOfA - priceOfB
  //       })
  //     )
  //   } else {
  //     setSortedProducts(products)
  //   }
  // }, [sortBy, products])

  // useEffect(() => {
  //   if (searchInCatString !== "") {
  //     setSortedProducts(prevSortedProducts =>
  //       prevSortedProducts.filter(
  //         product =>
  //           product.product_name
  //             .toLowerCase()
  //             .indexOf(searchInCatString.toLowerCase()) !== -1
  //       )
  //     )
  //   } else {
  //     setSortedProducts(products)
  //   }
  // }, [searchInCatString, products])

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={order ? order : ""}
          onChange={(e) => setOrder(e.target.value as number)}
        >
          <MenuItem value={1}>Price: Low to High</MenuItem>
          <MenuItem value={-1}>Price: High to Low</MenuItem>
        </Select>
      </FormControl>
      {data &&
        data.products.products.map((product, index) => (
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
      <br />
      {data && (
        <div className={classes.pagination}>
          <Pagination
            page={page}
            shape="rounded"
            count={Math.ceil(data.products.count / 20)}
            onChange={(_, page) => setPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default Category;
