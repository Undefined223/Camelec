import { MapContainer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FeatureCollection } from 'geojson';

interface TunisiaMapProps {
  governatesData: FeatureCollection;
}

const TunisiaMap: React.FC<TunisiaMapProps> = ({ governatesData }) => {
  // Simplified color scheme: three shades of blue
  const getColor = (orders: number) => {
    return orders > 500
      ? '#0077b6' // Dark blue for high orders
      : orders > 100
      ? '#00b4d8' // Medium blue for medium orders
      : '#90e0ef'; // Light blue for low orders
  };

  const styleFeature = (feature: any) => ({
    fillColor: getColor(feature?.properties?.orders || 0),
    weight: 1,
    opacity: 1,
    color: '#fff', // Border color
    fillOpacity: 0.7,
    dashArray: '',
  });

  const onEachFeature = (feature: any, layer: any) => {
    if (feature.properties) {
      const { gouv_fr, orders } = feature.properties;

      // Log the governorate name and orders for debugging
      console.log('Governorate Name:', gouv_fr);
      console.log('Orders:', orders);

      layer.bindPopup(`<div class="text-sm">
        <strong>${gouv_fr}</strong><br/>
        Orders: ${orders || 0}
      </div>`);

      layer.on({
        mouseover: (e: any) => {
          const layer = e.target;
          layer.setStyle({
            weight: 2,
            fillOpacity: 0.9,
          });
        },
        mouseout: (e: any) => {
          const layer = e.target;
          layer.setStyle({
            weight: 1,
            fillOpacity: 0.7,
          });
        },
      });
    }
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[34, 9]}
        zoom={6}
        className="h-[90%] w-[90%] mx-auto rounded-lg bg-slate-50"
        zoomControl={false}
        dragging={false}
        touchZoom={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        boxZoom={false}
        keyboard={false}
        attributionControl={false}
      >
        <GeoJSON data={governatesData} style={styleFeature} onEachFeature={onEachFeature} />

        <div className="absolute bottom-2 right-2 z-[1000] bg-white/90 p-2 rounded-lg shadow-lg text-xs">
          <div className="grid grid-cols-1 gap-1">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-[#0077b6]"></span>
              <span>High (500+ orders)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-[#00b4d8]"></span>
              <span>Medium (100-499 orders)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-[#90e0ef]"></span>
              <span>Low (0-99 orders)</span>
            </div>
          </div>
        </div>
      </MapContainer>
    </div>
  );
};

export default TunisiaMap;