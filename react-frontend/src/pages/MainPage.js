import React, { useState } from "react";
import UserNavBar from "../components/UserNavBar";
import ProductList from "../components/ProductList";
import Supermarket from "../components/Supermarket";

const MainPage = () => {
  
    return (
      <>
          <UserNavBar/>
          <ProductList/>
      </>
    );
};

export default MainPage;