import React, { useState } from "react";
import NavBar from "../components/NavBar";
import AdminPanel from "../components/AdminPanel";

const AdminPanelPage = ({ AdminPanelRole }) => {
  
    return (
      <>
          <NavBar NavBarUserRole = { AdminPanelRole } />
          <AdminPanel/>
      </>
    );
};

export default AdminPanelPage;