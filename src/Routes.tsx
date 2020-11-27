import React from "react";
import Home from "./Components/Home";
import { Redirect, Route, Switch } from "react-router-dom";
import Category from "./Components/Category";
import Product from "./Components/Product";

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/categories/:category">
        <Category />
      </Route>
      <Route path="/products/:id">
        <Product />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
};

export default Routes;
