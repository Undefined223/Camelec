"use client";

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  chart: {
    fontFamily: "Inter, sans-serif",
    type: "bar",
    height: 335,
    toolbar: {
      show: false,
    },
    animations: {
      enabled: true,
      dynamicAnimation: {
        speed: 400
      }
    }
  },
  colors: ["#0ea5e9", "#7dd3fc"],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "65%",
      borderRadius: 5,
      dataLabels: {
        position: 'top',
      },
    }
  },
  dataLabels: {
    enabled: false
  },
  grid: {
    borderColor: "#f1f5f9",
    strokeDashArray: 5,
  },
  xaxis: {
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  legend: {
    position: "top",
  },
  tooltip: {
    theme: "light"
  }
};

interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartTwo: React.FC = () => {

 
    const [sparkAnimation, setSparkAnimation] = useState(false);
    
    useEffect(() => {
      const interval = setInterval(() => {
        setSparkAnimation(true);
        setTimeout(() => setSparkAnimation(false), 300);
      }, 8000);
      
      return () => clearInterval(interval);
    }, []);

  const series = [
    {
      name: "Sales",
      data: [44, 55, 41, 67, 22, 43, 65],
    },
    {
      name: "Revenue",
      data: [13, 23, 20, 8, 13, 27, 15],
    },
  ];

  return (
    <div className={`col-span-12 rounded-lg border border-sky-100 bg-white p-5 shadow-md xl:col-span-4 relative overflow-hidden`}>
    {sparkAnimation && (
      <div className="absolute -right-2 top-5 h-6 w-6">
        <div className="absolute inset-0 animate-ping">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="text-yellow-400 fill-current">
            <path d="M11.983 1.907a1 1 0 0 1 1.826-.21l8 18a1 1 0 0 1-.233 1.14.996.996 0 0 1-1.09.09L14 17.28V23a1 1 0 0 1-1.6.8l-6-5A1 1 0 0 1 6 18v-5.084L1.232 11.65a1 1 0 0 1 .122-1.89l10-8a1 1 0 0 1 .629-.15v.297ZM8 12.767V17l3 2.5V16a1 1 0 0 1 .504-.868l5.466-3.031L8 12.767Z"/>
          </svg>
        </div>
      </div>
    )}
    <div className="mb-4 justify-between gap-4 sm:flex">
      <div>
        <h4 className="text-xl font-semibold text-sky-800">
          Weekly Energy Usage
        </h4>
      </div>
      <div>
        <div className="relative z-20 inline-block">
          <select
            name="#"
            id="#"
            className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium text-sky-800 outline-none"
          >
            <option value="">This Week</option>
            <option value="">Last Week</option>
          </select>
          <span className="absolute right-3 top-1/2 z-10 -translate-y-1/2">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z" fill="#0ea5e9"/>
            </svg>
          </span>
        </div>
      </div>
    </div>

    <div>
      <div id="chartTwo" className="-mb-9 -ml-5">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
          width={"100%"}
        />
      </div>
    </div>
  </div>
  );
};

export default ChartTwo;
