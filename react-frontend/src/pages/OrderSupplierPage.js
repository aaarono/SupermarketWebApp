import React, { useState } from "react";
import NavBar from "../components/NavBar";
import OrderSupplier from "../components/OrderSupplier";

const OrderSupplierPage = ({ OrderSupplierRole }) => {
  
    return (
      <>
          <NavBar NavBarUserRole = { OrderSupplierRole } />
          <OrderSupplier />
      </>
    );
};

export default OrderSupplierPage;