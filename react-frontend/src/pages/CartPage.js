import React, { useState } from "react";
import Cart from "../components/Cart";
import LoggedUserNavBar from "../components/LoggedUserNavBar";

const CartPage = () => {
  
    return (
      <>
          <LoggedUserNavBar/>
          <Cart/>
      </>
    );
};

export default CartPage;