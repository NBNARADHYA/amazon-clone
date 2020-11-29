import {
  Button,
  Container,
  makeStyles,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import AccessTokenContext from "../Context/AccessToken";
import { useLoginMutation } from "../generated/graphql";
import { ErrorAlert } from "./SignUp";

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

  const [errOpen, setErrOpen] = useState<boolean>(false);

  useEffect(() => {
    if (error) {
      setErrOpen(true);
    }
  }, [error]);
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
        validate={(values) => {
          const errors: Partial<LoginInput> = {};
          if (!values.email) {
            errors.email = "Email required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }

          if (!values.password) {
            errors.password = "Password required";
          }
          return errors;
        }}
        onSubmit={async ({ email, password }, { setSubmitting }) => {
          const response = await login({ variables: { email, password } });
          setAccessToken(response.data!.login.accessToken);
          localStorage.setItem("accessToken", response.data!.login.accessToken);
          setSubmitting(false);
          history.push("/");
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
            <ErrorMessage name="email" component={ErrorAlert} />
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
            <ErrorMessage name="password" component={ErrorAlert} />

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
            <Snackbar
              open={errOpen}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              autoHideDuration={6000}
              onClose={() => setErrOpen(false)}
            >
              <Alert onClose={() => setErrOpen(false)} severity="error">
                {error && error.message}
              </Alert>
            </Snackbar>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default Login;
