import React, { useState } from "react";
import ProductList from "../components/ProductList";
import Supermarket from "../components/Supermarket";
import LoggedUserNavBar from "../components/LoggedUserNavBar";

const UserPage = () => {
  
    return (
      <>
          <LoggedUserNavBar />
          <ProductList />
      </>
    );
};

export default UserPage;