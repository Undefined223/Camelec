"use client";
import React, { useEffect, useRef } from "react";
import { tunisiaPaths } from "@/app/components/js/tunisia";

// Extend the window interface to handle jsVectorMap
declare global {
  interface Window {
    jsVectorMap: {
      maps: Record<string, any>;
    };
  }
}

interface MapOneProps {
  className?: string;
}

const MapOne: React.FC<MapOneProps> = ({ className = "" }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Dynamically import jsvectormap to ensure it's loaded
    import("jsvectormap").then((jsVectorMapModule) => {
      const jsVectorMap = jsVectorMapModule.default;

      // Ensure the global object exists
      if (!window.jsVectorMap) {
        window.jsVectorMap = {
          maps: {},
        };
      }

      // Register the map definition
      window.jsVectorMap.maps["tunisia"] = {
        insets: [
          {
            width: 900,
            height: 1000,
            left: 100,
            top: 50,
            bbox: [
              [30.2404, 7.5245], // Southwest coordinates
              [37.7612, 11.5654], // Northeast coordinates
            ],
          },
        ],
        paths: tunisiaPaths,
      };

      // Log the map definition to verify it's registered
      console.log("Tunisia map registered:", window.jsVectorMap.maps["tunisia"]);

      // Initialize the map
      mapInstance.current = new jsVectorMap({
        selector: "#mapOne",
        map: "tunisia",
        zoomButtons: true,
        zoomOnScroll: true,
        zoomMax: 12,
        zoomMin: 1,

        // Styling
        regionStyle: {
          initial: {
            fill: "#C8D0D8",
            fillOpacity: 1,
            stroke: "#ffffff",
            strokeWidth: 1,
            strokeOpacity: 1,
          },
          hover: {
            fill: "#3056D3",
            cursor: "pointer",
          },
          selected: {
            fill: "#2449AF",
          },
          selectedHover: {},
        },

        // Labels configuration
        labels: {
          regions: {
            render(code: string) {
              const region = tunisiaPaths[code];
              return region ? region.name : code;
            },
          },
        },

        // Event handlers
        onRegionClick(event: any, code: string) {
          console.log("Region clicked:", code);
          // Add your click handler here
        },

        onRegionSelected(event: any, code: string, isSelected: boolean) {
          console.log("Region selected:", code, isSelected);
          // Add your selection handler here
        },
      });
    }).catch((error) => {
      console.error("Failed to load jsvectormap:", error);
    });

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className={`rounded-sm border border-stroke bg-white p-7.5 shadow-default ${className}`}>
      <div className="mb-4">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Tunisia Map
        </h4>
      </div>

      <div className="h-90">
        <div
          id="mapOne"
          ref={mapRef}
          className="h-full w-full"
        ></div>
      </div>
    </div>
  );
};

export default MapOne;