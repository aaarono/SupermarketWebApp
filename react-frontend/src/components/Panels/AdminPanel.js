// src/pages/AdminPanelPage.js

import React, { useState } from 'react';
import WarehousePanel from '../components/Panels/WarehousePanel';
import ProductPanel from '../components/Panels/ProductPanel';
import OrderPanel from '../components/Panels/OrderPanel';
import AddressPanel from '../components/Panels/AddressPanel';
import CategoryPanel from '../components/Panels/CategoryPanel';
import SupermarketPanel from '../components/Panels/SupermarketPanel';
import PaymentPanel from '../components/Panels/PaymentPanel';
import EmployeePanel from '../components/Panels/EmployeePanel';

function AdminPanelPage() {
  const [activePanel, setActivePanel] = useState('warehouse'); // Начальная панель

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
      case 'employee':
        return <EmployeePanel setActivePanel={setActivePanel} />;
      case 'statuses':
          return <OrderStatusPanel setActivePanel={setActivePanel}/> 
      default:
        return <WarehousePanel setActivePanel={setActivePanel} />;
    }
  };

  return <div>{renderActivePanel()}</div>;
}

export default AdminPanelPage;
