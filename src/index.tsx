import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import { DrawerProvider } from "./Context/Drawer";
import { SearchInCategoryProvider } from "./Context/SearchInCategory";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  cache: new InMemoryCache(),
});

ReactDOM.render(
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
  </ApolloProvider>,
  document.getElementById("root")
);
