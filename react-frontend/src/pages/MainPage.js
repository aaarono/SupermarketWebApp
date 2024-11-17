import React, { useState } from "react";
import NavBar from "../components/NavBar";
import ProductList from "../components/ProductList";

const MainPage = ({ MainPageUserRole }) => {
  
    return (
      <>
          <NavBar NavBarUserRole = { MainPageUserRole }/>
          <ProductList/>
      </>
    );
};

export default MainPage;