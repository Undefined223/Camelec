// components/Sidebar.tsx
import { useEffect, useState } from 'react';
import { Delivery, SidebarProps } from '../types/delivery';
import axiosInstance from './AxiosInstance';

const Sidebar: React.FC<SidebarProps> = ({ onSelectDelivery }) => {
  const [activeDeliveries, setActiveDeliveries] = useState<Delivery[]>([]);
  const [expandedDeliveryId, setExpandedDeliveryId] = useState<string | null>(null);

  useEffect(() => {
    const fetchActiveDeliveries = async () => {
      try {
        const response = await axiosInstance.get('/api/orders/progress');
        setActiveDeliveries(response.data);
      } catch (error) {
        console.error('Error fetching active deliveries:', error);
      }
    };

    fetchActiveDeliveries();
  }, []);

  const handleDeliveryClick = (deliveryId: string) => {
    if (expandedDeliveryId === deliveryId) {
      setExpandedDeliveryId(null); // Collapse if already expanded
    } else {
      setExpandedDeliveryId(deliveryId); // Expand the clicked delivery
    }
    onSelectDelivery(deliveryId); // Select the delivery
  };

  return (
    <div className="w-72 bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Active Deliveries</h2>
      <ul className="space-y-3">
        {activeDeliveries.map((delivery) => (
          <li
            key={delivery._id}
            className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div
              className="flex justify-between items-center"
              onClick={() => handleDeliveryClick(delivery._id)}
            >
              <span className="font-medium text-gray-700">
                Order of {delivery.userId.name}
              </span>
              <span className="text-gray-500 transform transition-transform">
                {expandedDeliveryId === delivery._id ? '▼' : '▶'}
              </span>
            </div>
            {expandedDeliveryId === delivery._id && (
              <div className="mt-3 pl-2 space-y-2 border-l-2 border-blue-200">
                <p className="text-sm text-gray-600">
                  <strong className="text-gray-700">Status:</strong> {delivery.orderStatus}
                </p>
                <p className="text-sm text-gray-600">
                  <strong className="text-gray-700">Payment:</strong> {delivery.paymentStatus}
                </p>
                <p className="text-sm text-gray-600">
                  <strong className="text-gray-700">Total:</strong> ${delivery.totalPrice.toFixed(2)}
                </p>
                <div className="mt-2">
                  <h3 className="text-sm font-semibold text-gray-700">Items:</h3>
                  <ul className="space-y-1">
                    {delivery.orderItems.map((item) => (
                      <li key={item._id} className="text-sm text-gray-600">
                        {item.product.name} (x{item.quantity}) - ${item.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;