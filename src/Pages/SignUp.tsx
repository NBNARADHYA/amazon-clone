import {
  Button,
  Container,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { SignUpInputType, useSignUpMutation } from "../generated/graphql";

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

const SignUp: React.FC<RouteComponentProps> = ({ history }) => {
  const initialValues: SignUpInputType = {
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  };

  const classes = useStyles();

  const [signUp, { error }] = useSignUpMutation({ fetchPolicy: "no-cache" });

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
        Sign up
      </Typography>

      <Formik
        initialValues={initialValues}
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
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default SignUp;
