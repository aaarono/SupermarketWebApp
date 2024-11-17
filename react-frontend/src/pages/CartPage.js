import React, { useState } from "react";
import Cart from "../components/Cart";
import NavBar from "../components/NavBar";

const CartPage = ({ CartUserRole }) => {
  
    return (
      <>
          <NavBar NavBarUserRole = { CartUserRole } />
          <Cart/>
      </>
    );
};

export default CartPage;