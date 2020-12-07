import {
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import {
  OrdersDocument,
  OrdersQuery,
  useCancelOrderMutation,
  useOrdersQuery,
} from "../generated/graphql";

const useStyles = makeStyles((theme: Theme) => ({
  spinner: {
    marginLeft: "47vw",
    marginTop: "40vh",
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
  paperHeader: {
    [theme.breakpoints.down("sm")]: {
      marginTop: "6%",
    },
    [theme.breakpoints.between("sm", "md")]: {
      marginTop: "4%",
    },
    [theme.breakpoints.up("lg")]: {
      marginTop: "2%",
    },
  },
  paper: {
    marginBottom: "30px",
  },
  header: {
    marginTop: "10%",
  },
  outerDiv: {
    paddingTop: "7vh",
    paddingBottom: "6vh",
  },
}));

const getDate = (timestamp: number): string => {
  const d = new Date(timestamp);
  return `${d.getDate()} ${d.getMonth()} ${d.getFullYear()}`;
};

const Orders: React.FC = () => {
  const { data, loading, error } = useOrdersQuery();
  const classes = useStyles();

  const [cancelOrder, { loading: cancelLoading }] = useCancelOrderMutation();

  if (error) {
    console.error(error);
    return null;
  }

  if (loading || !data) {
    return <CircularProgress className={classes.spinner} color="inherit" />;
  }

  return (
    <Container className={classes.outerDiv}>
      <Grid
        container
        direction="column"
        spacing={3}
        alignItems="center"
        justify="center"
      >
        <Grid item xs={12}>
          <Typography
            variant="h4"
            color="secondary"
            gutterBottom
            className={classes.header}
          >
            My Orders
          </Typography>
        </Grid>
        {data.orders.map((order, index) => (
          <Paper elevation={3} key={index} className={classes.paper}>
            <Grid
              item
              container
              direction="column"
              spacing={2}
              alignItems="center"
            >
              <Grid
                item
                container
                justify="flex-end"
                className={classes.paperHeader}
              >
                <Grid item xs={5}>
                  <Typography variant="subtitle2" color="primary">
                    ORDER PLACED
                    <br />
                    {getDate(order.createdAt)}
                  </Typography>
                </Grid>
                <Grid item xs={5}>
                  <Button
                    disabled={cancelLoading}
                    size="large"
                    color="secondary"
                    onClick={async () => {
                      try {
                        await cancelOrder({
                          variables: {
                            id: Number(order.id),
                          },
                          update: (cache, { errors }) => {
                            if (errors) {
                              return;
                            }
                            cache.writeQuery<OrdersQuery>({
                              query: OrdersDocument,
                              data: {
                                orders: [
                                  ...data.orders.slice(0, index),
                                  ...data.orders.slice(index + 1),
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
                    Cancel Order
                  </Button>
                </Grid>
                <Grid item xs={12} className={classes.divider}>
                  <Divider />
                </Grid>
              </Grid>
              <Grid item xs={12} container spacing={2} direction="column">
                {order.products.map(({ product }, index) => (
                  <React.Fragment key={index}>
                    <Grid container item spacing={1}>
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
                    </Grid>
                    {index !== order.products.length - 1 && (
                      <Grid item xs={12} className={classes.divider}>
                        <Divider />
                      </Grid>
                    )}
                  </React.Fragment>
                ))}
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Grid>
    </Container>
  );
};

export default Orders;
