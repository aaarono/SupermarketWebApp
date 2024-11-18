import React, { useState } from "react";
import NavBar from "../components/NavBar";

const ManageOrdersPage = ({ ManageOrdersRole }) => {
  
    return (
      <>
          <NavBar NavBarUserRole = { ManageOrdersRole } />
          <h1 textAlign = 'center'>Manage Orders { ManageOrdersRole }</h1>
      </>
    );
};

export default ManageOrdersPage;