import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import { DrawerProvider } from "./Context/Drawer";
import { SearchInCategoryProvider } from "./Context/SearchInCategory";
import { ApolloProvider } from "@apollo/client";
import { client } from "./apollo/Client";
import { AccessTokenProvider } from "./Context/AccessToken";

ReactDOM.render(
  <AccessTokenProvider>
    <ApolloProvider client={client}>
      <DrawerProvider>
        <SearchInCategoryProvider>
          <BrowserRouter>
            <div style={{ minHeight: "99vh", position: "relative" }}>
              <div style={{ paddingBottom: "6vh", paddingTop: "7vh" }}>
                <Navbar />
                <Routes />
                <Footer />
              </div>
            </div>
          </BrowserRouter>
        </SearchInCategoryProvider>
      </DrawerProvider>
    </ApolloProvider>
  </AccessTokenProvider>,
  document.getElementById("root")
);
