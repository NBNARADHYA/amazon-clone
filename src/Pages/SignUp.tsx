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
import React, { useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { SignUpInputType, useSignUpMutation } from "../generated/graphql";

const useStyles = makeStyles(() => ({
  formContainer: {
    textAlign: "center",
    width: "28%",
    paddingTop: "10vh",
    paddingBottom: "6vh",
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

export const ErrorAlert: React.FC = ({ children }) => {
  return <Alert severity="error">{children}</Alert>;
};

const SignUp: React.FC<RouteComponentProps> = ({ history }) => {
  const initialValues: SignUpInputType = {
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  };

  const classes = useStyles();

  const [signUp, { error }] = useSignUpMutation({ fetchPolicy: "no-cache" });
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
        Sign up
      </Typography>

      <Formik
        initialValues={initialValues}
        validate={(values) => {
          const errors: Partial<SignUpInputType> = {};
          if (!values.email) {
            errors.email = "Email required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }

          if (!values.password) {
            errors.password = "Password required";
          } else if (values.password.length < 5) {
            errors.password = "Must consist of min. 5 chars";
          }

          if (!values.firstName) {
            errors.firstName = "First name required";
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await signUp({ variables: { user: values } });
            history.push("/login");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field
              name="firstName"
              as={TextField}
              label="First Name"
              variant="outlined"
              fullWidth
            />
            <ErrorMessage name="firstName" component={ErrorAlert} />
            <br />
            <br />
            <Field
              name="lastName"
              as={TextField}
              label="Last Name"
              variant="outlined"
              fullWidth
            />
            <br />
            <br />
            <Field
              name="email"
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
              to="/login"
            >
              Already signed up ?
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
              Sign Up
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

export default SignUp;
