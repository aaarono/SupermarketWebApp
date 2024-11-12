import React, { useState } from "react";
import UserNavBar from "../components/UserNavBar";
import ProductList from "../components/ProductList";
import Supermarket from "../components/Supermarket";
import AdminNavBar from "../components/AdminNavBar";

const AdminPage = () => {
  
    return (
      <>
          <AdminNavBar/>
          <ProductList/>
      </>
    );
};

export default AdminPage;