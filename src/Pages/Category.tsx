import { QueryHookOptions } from "@apollo/client";
import {
  Divider,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Typography,
  CircularProgress,
  Container,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SearchInCategoryContext from "../Context/SearchInCategory";
import { Exact, ProductsQuery, useProductsQuery } from "../generated/graphql";

const useStyles = makeStyles(() => ({
  pagination: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: "6vh",
    marginTop: 30,
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

  const { searchInCatString } = useContext(SearchInCategoryContext)!;

  const options: QueryHookOptions<
    ProductsQuery,
    Exact<{
      category: string;
      order?: number | null | undefined;
      skip: number;
      take: number;
      search?: string | null | undefined;
    }>
  > = {
    variables: { category, order, skip: 20 * (page - 1), take: 20 },
  };

  if (searchInCatString !== "") {
    options.fetchPolicy = "no-cache";
    options.variables!.search = searchInCatString;
  }

  const { data, loading, error } = useProductsQuery(options);

  useEffect(() => {
    setPage(1);
  }, [category, searchInCatString]);

  if (error) {
    console.log(error);
  }

  if (loading) {
    return <CircularProgress color="secondary" className={classes.spinner} />;
  }

  return (
    <>
      <Container>
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
      </Container>
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
    </>
  );
};

export default Category;
