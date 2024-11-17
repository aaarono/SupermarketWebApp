import React, { useState } from "react";
import NavBar from "../components/NavBar";

const OrdersPage = ({ OrdersUserRole }) => {
  
    return (
      <>
          <NavBar NavBarUserRole = { OrdersUserRole } />
          <h1>Your Orders, Mr.{ OrdersUserRole }</h1>
      </>
    );
};

export default OrdersPage;