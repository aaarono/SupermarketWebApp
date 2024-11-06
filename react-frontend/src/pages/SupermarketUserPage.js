import React, { useState } from "react";
import Supermarket from "../components/Supermarket";
import LoggedUserNavBar from "../components/LoggedUserNavBar";

const SupermarketUserPage = () => {
  
    return (
      <>
          <LoggedUserNavBar/>
          <Supermarket/>
      </>
    );
};

export default SupermarketUserPage;