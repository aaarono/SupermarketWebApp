// src/pages/AdminPanelPage.js

import React, { useState } from 'react';
import ProductPanel from '../components/Panels/ProductPanel';
import OrderPanel from '../components/Panels/OrderPanel';
import AddressPanel from '../components/Panels/AddressPanel';
import CategoryPanel from '../components/Panels/CategoryPanel';
import WarehousePanel from '../components/Panels/WarehousePanel';
import SupermarketPanel from '../components/Panels/SupermarketPanel';
import PaymentPanel from '../components/Panels/PaymentPanel';
import EmployeePanel from '../components/Panels/EmployeePanel';
import NavBar from '../components/NavBar';
import CardPanel from '../components/Panels/KartaPannel';
import CashPanel from '../components/Panels/HotovostPannel';

function AdminPanelPage({ AdminPanelRole }) {
  const [activePanel, setActivePanel] = useState('product'); // Начальная панель

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'product':
        return <ProductPanel setActivePanel={setActivePanel} />;
      case 'order':
        return <OrderPanel setActivePanel={setActivePanel} />;
      case 'address':
        return <AddressPanel setActivePanel={setActivePanel} />;
      case 'category':
        return <CategoryPanel setActivePanel={setActivePanel} />;
      case 'warehouse':
        return <WarehousePanel setActivePanel={setActivePanel} />;
      case 'supermarket':
        return <SupermarketPanel setActivePanel={setActivePanel} />;
      case 'payment':
        return <PaymentPanel setActivePanel={setActivePanel} />;
      case 'card':
        return <CardPanel setActivePanel={setActivePanel} />;
      case 'cash':
        return <CashPanel setActivePanel={setActivePanel} />;
      case 'employee':
        return <EmployeePanel setActivePanel={setActivePanel} />;
      default:
        return <ProductPanel setActivePanel={setActivePanel} />;
    }
  };

  return (
    <>
      <NavBar NavBarUserRole = { AdminPanelRole } />
      {renderActivePanel()}
    </>
  );
}

export default AdminPanelPage;