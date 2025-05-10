import { useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet for custom icons
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import UserContext from '../context/InfoPlusProvider';
import socket from '../utils/socket';

interface Location {
  latitude: number;
  longitude: number;
}

interface DeliveryMapProps {
  orderId: string;
}

// Define a custom delivery truck icon
const deliveryIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3097/3097144.png', // Replace with your delivery truck icon URL
  iconSize: [40, 40], // Size of the icon
  iconAnchor: [20, 40], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -40], // Point from which the popup should open relative to the iconAnchor
});

const DeliveryMap: React.FC<DeliveryMapProps> = ({ orderId }) => {
  const [location, setLocation] = useState<Location | null>(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (orderId && user?._id) {
      console.log('Joining delivery room:', { orderId, userId: user._id });
      socket.emit('joinDeliveryRoom', { orderId, userId: user._id });
  
      const handleLocationUpdate = ({ orderId: updatedOrderId, location }: 
      { orderId: string, location: Location }) => {
        console.log('Location updated:', { updatedOrderId, location });
        if (updatedOrderId === orderId) {
          setLocation(location);
        }
      };
  
      socket.on('locationUpdated', handleLocationUpdate);
  
      return () => {
        // Remove the event listener when component unmounts
        socket.off('locationUpdated', handleLocationUpdate);
        console.log('Cleaned up locationUpdated listener');
      };
    }
  }, [orderId, user?._id]); // Remove socket from dependencies

  if (!location) {
    return <p>Loading location...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Delivery Map for Order ID: {orderId}</h2>
      <div style={{ height: '400px', width: '100%' }}>
        <MapContainer
          center={[location.latitude, location.longitude]} // Initial map center
          zoom={13} // Initial zoom level
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // OpenStreetMap tiles
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker
            position={[location.latitude, location.longitude]} // Marker position
            icon={deliveryIcon} // Custom delivery icon
          >
            <Popup>
              Delivery in progress! <br /> Order ID: {orderId}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default DeliveryMap;