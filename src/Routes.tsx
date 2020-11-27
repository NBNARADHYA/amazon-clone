import React from "react";
import Home from "./Pages/Home";
import { Redirect, Route, Switch } from "react-router-dom";
import Category from "./Pages/Category";
import Product from "./Pages/Product";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/categories/:category" component={Category} />
      <Route path="/products/:id" component={Product} />
      <Route path="/signup" component={SignUp} />
      <Route path="/login" component={Login} />
      <Redirect to="/" />
    </Switch>
  );
};

export default Routes;
