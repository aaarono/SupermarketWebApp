import React, { useState } from "react";
import NavBar from "../components/NavBar";
import ManageOrders from "../components/ManageOrders";

const ManageOrdersPage = ({ ManageOrdersRole }) => {
  
    return (
      <>
          <NavBar NavBarUserRole = { ManageOrdersRole } />
          <ManageOrders />
      </>
    );
};

export default ManageOrdersPage;