import React, { useState } from "react";
import NavBar from "../components/NavBar";

const AdminPanelPage = ({ AdminPanelRole }) => {
  
    return (
      <>
          <NavBar NavBarUserRole = { AdminPanelRole } />
          <h1 textAlign = 'center'>Admin Panel { AdminPanelRole }</h1>
      </>
    );
};

export default AdminPanelPage;