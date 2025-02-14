import { useEffect, useState } from 'react';
import TunisiaMap from '@/app/components/TunisiaMap';
import { FeatureCollection } from 'geojson';
import axios from 'axios';
import axiosInstance from '../AxiosInstance';

const HomePage: React.FC = () => {
  const [governatesData, setGovernatesData] = useState<FeatureCollection | null>(null);

  // Fetch order counts by city from the API
  const fetchOrdersByCity = async () => {
    try {
      const response = await axiosInstance.get('/api/orders/by-city'); // Replace with your API endpoint
      return response.data; // Returns { city1: count1, city2: count2, ... }
    } catch (error) {
      console.error('Error fetching orders by city:', error);
      return {};
    }
  };

  // Normalize names for matching
  const normalizeName = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD') // Normalize accents
      .replace(/[\u0300-\u036f]/g, ''); // Remove accents
  };

  // Update GeoJSON with order counts
  const updateGeoJSONWithOrders = async (governatesData: FeatureCollection) => {
    const ordersByCity = await fetchOrdersByCity();

    const updatedGeoJSON = {
      ...governatesData,
      features: governatesData.features.map((feature) => {
        const governorateName = normalizeName(feature.properties?.gouv_fr); // Normalize governorate name

        // Log the governorate name for debugging
        console.log('Governorate Name:', governorateName);

        // Find matching cities in ordersByCity
        const matchingCities = Object.keys(ordersByCity).filter(
          (city) => normalizeName(city) === governorateName
        );

        // Log matching cities for debugging
        console.log('Matching Cities:', matchingCities);

        // Calculate total orders for the governorate
        const totalOrders = matchingCities.reduce((sum, city) => {
          return sum + (ordersByCity[city] || 0);
        }, 0);

        return {
          ...feature,
          properties: {
            ...feature.properties,
            orders: totalOrders,
          },
        };
      }),
    };

    return updatedGeoJSON;
  };

  useEffect(() => {
    const fetchData = async () => {
      // Fetch GeoJSON data from the public folder
      const response = await fetch(
        'https://raw.githubusercontent.com/Undefined223/Tunisia-GeoJson/refs/heads/main/tunisia.geojson'
      );
      const geoJSON = await response.json();

      // Update GeoJSON with order counts
      const updatedGeoJSON = await updateGeoJSONWithOrders(geoJSON);
      setGovernatesData(updatedGeoJSON);
    };

    fetchData();
  }, []);

  if (!governatesData) {
    return <div className="flex justify-center items-center h-screen">Loading map data...</div>;
  }

  return (
    <div className="col-span-12 xl:col-span-6">
      <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
          Regional Orders Distribution
        </h4>
        <div className="h-[400px]">
          <TunisiaMap governatesData={governatesData} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;  