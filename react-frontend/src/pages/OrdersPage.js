import React, { useState } from "react";
import NavBar from "../components/NavBar";
import OrdersList from "../components/OrdersList";

const OrdersPage = ({ OrdersUserRole }) => {
  
    return (
      <>
          <NavBar NavBarUserRole = { OrdersUserRole } />
          <OrdersList />
      </>
    );
};

export default OrdersPage;