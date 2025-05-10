"use client";

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options:ApexOptions = {
  chart: {
    fontFamily: "Inter, sans-serif",
    height: 335,
    type: "area",
    toolbar: {
      show: false,
    },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      dynamicAnimation: {
        enabled: true,
        speed: 350
      }
    }
  },
  colors: ["#0ea5e9", "#38bdf8"],
  fill: {
    type: "gradient",
    gradient: {
      shade: "light",
      type: "vertical",
      shadeIntensity: 0.3,
      opacityFrom: 0.4,
      opacityTo: 0.1,
      stops: [0, 95, 100]
    }
  },
  grid: {
    borderColor: "#f1f5f9",
    strokeDashArray: 5,
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    },
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: "smooth",
    width: 3,
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
  tooltip: {
    theme: "light"
  },
  legend: {
    position: "top",
  }
};


interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartOne: React.FC = () => {

  const [isBlinking, setIsBlinking] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 7000);
    
    return () => clearInterval(interval);
  }, []);
  const series = [
      {
        name: "Product One",
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45],
      },

      {
        name: "Product Two",
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51],
      },
    ]

  return (
    <div className={`col-span-12 rounded-lg border ${isBlinking ? 'border-sky-400' : 'border-sky-100'} bg-white px-5 pb-5 pt-7 shadow-md xl:col-span-8`}>
    <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
      <div className="flex w-full flex-wrap gap-3 sm:gap-5">
        <div className="flex min-w-48">
          <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-sky-500">
            <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-sky-500"></span>
          </span>
          <div className="w-full">
            <p className="font-semibold text-sky-500">Power Consumption</p>
            <p className="text-sm font-medium text-gray-500">Last 12 months</p>
          </div>
        </div>
        <div className="flex min-w-48">
          <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-sky-300">
            <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-sky-300"></span>
          </span>
          <div className="w-full">
            <p className="font-semibold text-sky-300">Efficiency Rate</p>
            <p className="text-sm font-medium text-gray-500">Last 12 months</p>
          </div>
        </div>
      </div>
      <div className="flex w-full max-w-45 justify-end">
        <div className="inline-flex items-center rounded-md bg-sky-50 p-1.5">
          <button className="rounded bg-white px-3 py-1 text-xs font-medium text-sky-800 shadow">
            Day
          </button>
          <button className="rounded px-3 py-1 text-xs font-medium text-sky-600">
            Week
          </button>
          <button className="rounded px-3 py-1 text-xs font-medium text-sky-600">
            Month
          </button>
        </div>
      </div>
    </div>

    <div>
      <div id="chartOne" className="-ml-5">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={350}
          width={"100%"}
        />
      </div>
    </div>
  </div>
  );
};

export default ChartOne;
