import React, { useState } from "react";
import EmployeeInfo from "../components/EmployeeInfo";
import NavBar from "../components/NavBar";

const EmployeeInfoPage = ({ EmployeeInfoRole }) => {
  
    return (
      <>
          <NavBar NavBarUserRole = { EmployeeInfoRole } />
          <EmployeeInfo/>
      </>
    );
};

export default EmployeeInfoPage;