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
import UserPanel from '../components/Panels/UserPanel';
import OrderProductPanel from '../components/Panels/OrderProductPanel';
import ProductSupplierPanel from '../components/Panels/ProductSupplierPanel';
import SupplierPanel from '../components/Panels/SupplierPanel';
import ImagePanel from '../components/Panels/ImagePanel';
import FormatPanel from '../components/Panels/FormatPanel';
import PositionPanel from '../components/Panels/PositionPanel';
import RolePanel from '../components/Panels/RolePanel';
import LogPanel from '../components/Panels/LogPanel';
import OrderStatusPanel from '../components/Panels/OrderStatusPanel'

function AdminPanelPage({ AdminPanelRole }) {
  const [activePanel, setActivePanel] = useState('user');

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'user':
        return <UserPanel setActivePanel={setActivePanel} />; // TODO: реализовать UserPanel
      case 'employee':
        return <EmployeePanel setActivePanel={setActivePanel} />;
      case 'product':
        return <ProductPanel setActivePanel={setActivePanel} />;
      case 'order-product':
        return <OrderProductPanel setActivePanel={setActivePanel} />;
      case 'product-supplier':
        return <ProductSupplierPanel setActivePanel={setActivePanel} />;
      case 'supplier':
        return <SupplierPanel setActivePanel={setActivePanel} />; // TODO реализовать SupplierPanel
      case 'image':
        return <ImagePanel setActivePanel={setActivePanel} />; // TODO реализовать ImagePanel
      case 'format':
        return <FormatPanel setActivePanel={setActivePanel} />;
      case 'position':
        return <PositionPanel setActivePanel={setActivePanel} />;
      case 'role':
        return <RolePanel setActivePanel={setActivePanel} />;
      case 'log':
        return <LogPanel setActivePanel={setActivePanel} />;
      case 'order':
        return <OrderPanel setActivePanel={setActivePanel} />; // TODO реализовать OrderPanel
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
      case 'statuses':
        return <OrderStatusPanel setActivePanel={setActivePanel} />;
      default:
        return <UserPanel setActivePanel={setActivePanel} />;
    }
  };

  return (
    <>
      <NavBar NavBarUserRole={AdminPanelRole} />
      {renderActivePanel()}
    </>
  );
}

export default AdminPanelPage;