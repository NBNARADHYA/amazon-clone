import React from "react";
import { RouteComponentProps } from "react-router-dom";
import queryString from "query-string";
import { Container, makeStyles } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles(() => ({
  successAlert: {
    textAlign: "center",
    paddingTop: "20vh",
    paddingBottom: "6vh",
  },
}));

const PostPayment: React.FC<RouteComponentProps> = ({ location, history }) => {
  const query = queryString.parse(location.search);
  const classes = useStyles();

  if (query["success"] !== "true" && query["success"] !== "false") {
    history.push("/");
    return null;
  }

  const success = query["success"] === "true";

  return (
    <Container className={classes.successAlert}>
      <Alert
        onClose={() => {
          if (success) {
            history.push("/orders");
          } else {
            history.push("/");
          }
        }}
        severity={success ? "success" : "error"}
      >
        {success
          ? "Your order was placed successfully !"
          : "Sorry, there was a problem while placing your order !"}
      </Alert>
    </Container>
  );
};

export default PostPayment;
