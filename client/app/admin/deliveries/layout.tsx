// components/Layout.tsx
"use client";


import { useState } from 'react';
import Sidebar from '@/app/components/MapSideBar';
import DeliveryMap from '@/app/components/DeliveryMap';

const Layout: React.FC = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleSelectDelivery = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar onSelectDelivery={handleSelectDelivery} />
      <div className="flex-1 p-4">
        {selectedOrderId ? <DeliveryMap orderId={selectedOrderId} /> : <p>Select a delivery to view the map</p>}
      </div>
    </div>
  );
};

export default Layout;
