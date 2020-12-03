import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { DrawerProvider } from "./Context/Drawer";
import { SearchInCategoryProvider } from "./Context/SearchInCategory";
import { ApolloProvider } from "@apollo/client";
import { client } from "./apollo/Client";
import { AccessTokenProvider } from "./Context/AccessToken";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import Routes from "./Routes";

ReactDOM.render(
  <ApolloProvider client={client}>
    <AccessTokenProvider>
      <DrawerProvider>
        <SearchInCategoryProvider>
          <BrowserRouter>
            <div
              style={{
                minHeight: "99vh",
                position: "relative",
                // paddingBottom: "6vh",
                // paddingTop: "7vh",
              }}
            >
              <Navbar />
              <Routes />
              <Footer />
            </div>
          </BrowserRouter>
        </SearchInCategoryProvider>
      </DrawerProvider>
    </AccessTokenProvider>
  </ApolloProvider>,
  document.getElementById("root")
);
