import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import { DrawerProvider } from "./Context/Drawer";
import { SearchInCategoryProvider } from "./Context/SearchInCategory";

ReactDOM.render(
  <DrawerProvider>
    <SearchInCategoryProvider>
      <div style={{ minHeight: "99vh", position: "relative" }}>
        <Navbar />
        <App />
        <Footer />
      </div>
    </SearchInCategoryProvider>
  </DrawerProvider>,
  document.getElementById("root")
);
