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
  Grid,
  Theme,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SearchInCategoryContext from "../Context/SearchInCategory";
import { Exact, ProductsQuery, useProductsQuery } from "../generated/graphql";

const useStyles = makeStyles((theme: Theme) => ({
  pagination: {
    top: "auto",
    bottom: "6vh",
    marginTop: "3%",
  },
  productImg: {
    [theme.breakpoints.down("sm")]: {
      width: "40%",
    },
    [theme.breakpoints.between("sm", "md")]: {
      width: "50%",
    },
    [theme.breakpoints.up("lg")]: {
      width: "55%",
    },
  },
  link: {
    textDecoration: "none",
  },
  divider: {
    [theme.breakpoints.down("sm")]: {
      paddingTop: "6%",
      paddingBottom: "12%",
    },
    [theme.breakpoints.between("sm", "md")]: {
      paddingTop: "4%",
      paddingBottom: "8%",
    },
    [theme.breakpoints.up("lg")]: {
      paddingTop: "2%",
      paddingBottom: "4%",
    },
  },
  formControl: {
    [theme.breakpoints.down("sm")]: {
      minWidth: "30%",
    },
    [theme.breakpoints.between("sm", "md")]: {
      minWidth: "15%",
    },
    [theme.breakpoints.up("lg")]: {
      minWidth: "10%",
    },
    paddingBottom: "2%",
  },
  spinner: {
    marginLeft: "47vw",
    marginTop: "40vh",
  },
  outerDiv: {
    paddingTop: "7vh",
    paddingBottom: "6vh",
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
    console.error(error);
    return null;
  }

  if (loading || !data) {
    return <CircularProgress color="inherit" className={classes.spinner} />;
  }

  return (
    <div className={classes.outerDiv}>
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
        {data && (
          <Grid container spacing={2} direction="column">
            {data.products.products.map((product, index) => (
              <Grid container item key={index} spacing={1}>
                <Grid item xs={12} sm={6} md={4}>
                  <img
                    src={product.imageUrl!}
                    alt={product.name}
                    className={classes.productImg}
                  />
                </Grid>
                <Grid
                  item
                  container
                  spacing={1}
                  xs={12}
                  sm={6}
                  md={8}
                  direction="column"
                >
                  <Grid item>
                    <Typography
                      variant="body1"
                      component={Link}
                      to={`/products/${product.id}`}
                      className={classes.link}
                    >
                      {product.name}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1">
                      {product.price} {product.currency}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12} className={classes.divider}>
                  <Divider />
                </Grid>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      {data && (
        <Grid container justify="center">
          <Grid item className={classes.pagination}>
            <Pagination
              page={page}
              shape="rounded"
              count={Math.ceil(data.products.count / 20)}
              onChange={(_, page) => setPage(page)}
            />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Category;
