import {
  Button,
  Container,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useContext } from "react";
import DrawerContext from "../Context/Drawer";

const useStyles = makeStyles(() => ({
  container: {
    paddingTop: "24vh",
    paddingBottom: "10vh",
  },
}));

const Home: React.FC = () => {
  const { setDrawerState } = useContext(DrawerContext)!;
  const classes = useStyles();
  return (
    <Container className={classes.container}>
      <Grid
        container
        justify="center"
        alignItems="center"
        direction="column"
        spacing={10}
      >
        <Grid item>
          <Typography variant="h1" color="textPrimary">
            Welcome to Amazon Clone
          </Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={() => setDrawerState(-1)}>
            <Typography variant="h2" color="textSecondary">
              All Categories
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};
export default Home;
