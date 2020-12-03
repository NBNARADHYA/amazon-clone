import React from "react";
import Home from "./Pages/Home";
import { Redirect, Route, Switch } from "react-router-dom";
import Category from "./Pages/Category";
import Product from "./Pages/Product";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import Orders from "./Pages/Orders";
import PostPayment from "./Pages/PostPayment";

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/categories/:category" component={Category} />
      <Route path="/products/:id" component={Product} />
      <Route path="/signup" component={SignUp} />
      <Route path="/login" component={Login} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/orders" component={Orders} />
      <Route path="/post_payment" component={PostPayment} />
      <Redirect to="/" />
    </Switch>
  );
};

export default Routes;
