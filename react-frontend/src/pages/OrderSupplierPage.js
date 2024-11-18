import React, { useState } from "react";
import NavBar from "../components/NavBar";

const OrderSupplierPage = ({ OrderSupplierRole }) => {
  
    return (
      <>
          <NavBar NavBarUserRole = { OrderSupplierRole } />
          <h1 textAlign = 'center'>Order Supplier { OrderSupplierRole }</h1>
      </>
    );
};

export default OrderSupplierPage;