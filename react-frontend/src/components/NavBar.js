import React, { useState } from "react";
import AdminNavBar from "./NavBarTypes/AdminNavBar";
import EmployeeNavBar from "./NavBarTypes/EmployeeNavBar";
import PublicNavBar from "./NavBarTypes/PublicNavBar";
import UserNavBar from "./NavBarTypes/UserNavBar";

const NavBar = ({ NavBarUserRole }) => {
    
    if (NavBarUserRole === 'user') {
        return <UserNavBar NavBarTypeRole = { NavBarUserRole } />
    } else if (NavBarUserRole === 'admin') { 
        return <AdminNavBar NavBarTypeRole = { NavBarUserRole } />
    } else if (NavBarUserRole === 'employee') {
        return <EmployeeNavBar NavBarTypeRole = { NavBarUserRole } />
    } else {
        return <PublicNavBar/> // Default to public nav bar if no role is provided.
    }

};

export default NavBar;