import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles(() => ({
  footer: {
    height: "5vh",
    position: "absolute",
    bottom: "0",
    width: "100%",
  },
  link: {
    color: "#757575",
  },
}));

const Copyright: React.FC = () => {
  const classes = useStyles();
  return (
    <Typography variant="body1" align="center">
      {"Copyright © "}
      <Link className={classes.link} to="/">
        Amazon Clone
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const Footer: React.FC = () => {
  const classes = useStyles();
  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={classes.footer}
    >
      <Grid item>
        <Copyright />
      </Grid>
    </Grid>
  );
};

export default Footer;
