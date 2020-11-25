import React from "react";
import { Container } from "@material-ui/core";
import Home from "./Components/Home";
import { Redirect, Route, Switch } from "react-router-dom";

const Routes: React.FC = () => {
  return (
    <Container style={{ paddingTop: "180px" }}>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Redirect to="/" />
      </Switch>
    </Container>
  );
};

export default Routes;
