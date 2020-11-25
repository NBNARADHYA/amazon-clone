import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles(() => ({
  footer: {
    backgroundColor: "#4d4d4d",
    color: "#e6e6e6",
    height: "5vh",
    display: "flex",
    position: "absolute",
    bottom: "0",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    color: "#e6e6e6",
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
    <div className={classes.footer}>
      <Copyright />
    </div>
  );
};

export default Footer;
