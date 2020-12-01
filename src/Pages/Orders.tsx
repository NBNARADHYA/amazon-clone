import {
  Button,
  CircularProgress,
  Container,
  Divider,
  makeStyles,
  Paper,
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

const useStyles = makeStyles(() => ({
  spinner: {
    left: "50%",
    marginLeft: "-4em",
  },
  productDiv: {
    overflow: "auto",
    marginTop: "20px",
  },
  divider: {
    marginTop: "10px",
    marginBottom: "20px",
  },
  productImg: {
    height: "165px",
    float: "left",
    marginRight: "50px",
  },
  link: {
    textDecoration: "none",
  },
  price: {
    float: "left",
  },
  body: {
    marginTop: "30px",
  },
  paperHeader: {
    padding: "20px",
    float: "left",
  },
  paper: {
    marginBottom: "30px",
  },
  header: {
    marginTop: "20px",
    marginBottom: "20px",
    textAlign: "center",
  },
  paperBody: {
    clear: "both",
  },
  cancelOrderBtn: {
    padding: "20px",
    float: "right",
  },
}));

const getDate = (timestamp: number): string => {
  const d = new Date(timestamp);
  return `${d.getDate()} ${d.getMonth()} ${d.getFullYear()}`;
};

const Orders: React.FC = () => {
  const { data, loading, error } = useOrdersQuery();
  const classes = useStyles();

  const [cancelOrder] = useCancelOrderMutation();

  if (error) {
    console.error(error);
    return null;
  }

  if (loading || !data) {
    return <CircularProgress className={classes.spinner} color="secondary" />;
  }

  return (
    <Container>
      <Typography
        variant="h4"
        color="secondary"
        gutterBottom
        className={classes.header}
      >
        My Orders
      </Typography>
      <Divider className={classes.divider} />
      {data.orders.map((order, index) => (
        <Paper elevation={3} key={index} className={classes.paper}>
          <Typography
            variant="subtitle2"
            color="primary"
            className={classes.paperHeader}
          >
            ORDER PLACED
            <br />
            {getDate(order.createdAt)}
          </Typography>
          <Button
            size="large"
            color="secondary"
            className={classes.cancelOrderBtn}
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
          <div className={classes.paperBody}>
            <Divider />
            {order.products.map(({ product }, index) => (
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
                  </div>
                </div>
                {index !== order.products.length - 1 && (
                  <Divider className={classes.divider} />
                )}
              </div>
            ))}
          </div>
          <br />
          <Divider />
        </Paper>
      ))}
    </Container>
  );
};

export default Orders;
