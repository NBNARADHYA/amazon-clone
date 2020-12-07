import {
  Button,
  Container,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React, { useContext } from "react";
import DrawerContext from "../Context/Drawer";

const useStyles = makeStyles(() => ({
  container: {
    textAlign: "center",
  },
  title: {
    paddingTop: "24vh",
    paddingBottom: "10vh",
  },
}));

const Home: React.FC = () => {
  const { setDrawerState } = useContext(DrawerContext)!;
  const classes = useStyles();
  const theme = useTheme();

  const isSmOrXs = useMediaQuery(theme.breakpoints.down("md"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));

  return (
    <Container className={classes.container}>
      <Typography
        variant={isSmOrXs ? "h4" : isMd ? "h3" : "h1"}
        color="textPrimary"
        className={classes.title}
      >
        Welcome to Amazon Clone
      </Typography>
      <Button variant="contained" onClick={() => setDrawerState(-1)}>
        <Typography
          variant={isSmOrXs ? "h5" : isMd ? "h4" : "h3"}
          color="textSecondary"
        >
          All Categories
        </Typography>
      </Button>
    </Container>
  );
};
export default Home;
