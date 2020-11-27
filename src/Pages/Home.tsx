import { Button, Container, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import DrawerContext from "../Context/Drawer";

const Home: React.FC = () => {
  const { setDrawerState } = useContext(DrawerContext)!;
  return (
    <Container style={{ paddingTop: "180px" }}>
      <Typography variant="h1" color="textPrimary">
        Welcome to Amazon Clone
      </Typography>
      <div style={{ textAlign: "center" }}>
        <Button
          variant="contained"
          style={{ marginTop: "100px" }}
          onClick={() => setDrawerState(-1)}
        >
          <Typography variant="h2" color="textSecondary">
            All Categories
          </Typography>
        </Button>
      </div>
    </Container>
  );
};
export default Home;
