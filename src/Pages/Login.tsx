import {
  Button,
  Container,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import React, { useContext } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import AccessTokenContext from "../Context/AccessToken";
import { useLoginMutation } from "../generated/graphql";

const useStyles = makeStyles(() => ({
  formContainer: {
    textAlign: "center",
    width: "28%",
    paddingBottom: "50px",
    paddingTop: "60px",
  },
  formHeader: {
    fontSize: "35px",
  },
  submitBtn: {
    width: "200px",
    fontSize: "20px",
    marginTop: "20px",
  },
}));

interface LoginInput {
  email: string;
  password: string;
}

const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const initialValues: LoginInput = {
    email: "",
    password: "",
  };

  const classes = useStyles();

  const { setAccessToken } = useContext(AccessTokenContext)!;

  const [login, { error }] = useLoginMutation({ fetchPolicy: "no-cache" });

  if (error) {
    return <div>{JSON.stringify(error, null, 2)}</div>;
  }

  return (
    <Container className={classes.formContainer}>
      <Typography
        variant="overline"
        className={classes.formHeader}
        color="secondary"
      >
        Login
      </Typography>

      <Formik
        initialValues={initialValues}
        onSubmit={async ({ email, password }, { setSubmitting }) => {
          try {
            const response = await login({ variables: { email, password } });
            setAccessToken(response.data!.login.accessToken);
            localStorage.setItem(
              "accessToken",
              response.data!.login.accessToken
            );
          } finally {
            setSubmitting(false);
            history.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field
              name="email"
              type="email"
              as={TextField}
              label="Email"
              variant="outlined"
              fullWidth
            />
            <br />
            <br />
            <Field
              name="password"
              type="password"
              as={TextField}
              label="Password"
              variant="outlined"
              fullWidth
            />
            <br />
            <Typography
              variant="overline"
              color="textSecondary"
              component={Link}
              to="/signup"
            >
              Not signed up ?
            </Typography>
            <br />
            <Button
              type="submit"
              size="large"
              variant="contained"
              color="secondary"
              className={classes.submitBtn}
              disabled={isSubmitting}
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default Login;
