
import Image from "next/image";
import { useEffect, useState } from "react";

const sourcesData = [
  {
    name: "Solar",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85 1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"/>
      </svg>
    ),
    visitors: 3.5,
    revenues: "5,768",
    sales: 590,
    conversion: 4.8,
  },
  {
    name: "Wind",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10.5 15a2.5 2.5 0 1 1 2.45 2.987c-.204.01-.399-.03-.599-.03H5a1 1 0 0 1 0-2h7.351a.5.5 0 1 0 .149-.957zM13 7a3 3 0 0 1 6 0v1h-6V7zm-2.5 1a2.501 2.501 0 0 1-2.031 2.455c-.118.025-.22.044-.33.045H3a1 1 0 0 1 0-2h5.139a.5.5 0 1 0 .361-.949c.166-.017 0-.051 0-.051a2.5 2.5 0 0 1 2-2.5h10a1 1 0 0 1 0 2l-10 .003a.5.5 0 0 0-.5.497 2.5 2.5 0 0 1 .5.5zM16 20a3 3 0 0 1-3-3h6a3 3 0 0 1-3 3z"/>
      </svg>
    ),
    visitors: 2.2,
    revenues: "4,635",
    sales: 467,
    conversion: 4.3,
  },
  {
    name: "Hydro",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3.1L7.05 8.05a7 7 0 1 0 9.9 0L12 3.1zm0-2.828l6.364 6.364a9 9 0 1 1-12.728 0L12 .272zM13 12V7h-2v5h-3l4 4 4-4h-3z"/>
      </svg>
    ),
    visitors: 2.1,
    revenues: "4,290",
    sales: 420,
    conversion: 3.7,
  },
  {
    name: "Nuclear",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-2a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm9.39 4.58-1.91.64a.991.991 0 0 0-.61.57 7.04 7.04 0 0 1-2.22 2.52.97.97 0 0 0-.36.76l.08 2a1 1 0 0 1-.93 1.07h-.13a2.98 2.98 0 0 1-2.44-1.25 3 3 0 0 1-.62-1.82 1 1 0 0 1 1.09-.9l1.94.25c.3.03.59-.1.79-.33a5.02 5.02 0 0 0 1.58-2.56A1.97 1.97 0 0 1 17.5 14h1.56c.69 0 1.28.5 1.38 1.19a1 1 0 0 1-.69 1.11 1 1 0 0 1-.36.07v-.79zm-14.88.43a1 1 0 0 1-1.48 1.05l-1.86-.93a1 1 0 0 1-.53-1.2 1 1 0 0 1 .93-.63h1.46a1.98 1.98 0 0 1 1.74 1.03 5.55 5.55 0 0 0 1.92 2.06.99.99 0 0 0 .81.09l2.13-.71A.981.981 0 0 1 13 16a3 3 0 0 1-.74 1.66v-.02a3 3 0 0 1-2.32 1.1h-.04a.99.99 0 0 1-.88-1.13l.23-1.88a.99.99 0 0 0-.4-.94 7.14 7.14 0 0 1-2.24-2.69.996.996 0 0 0-.62-.49l-1.92-.42a1 1 0 0 1-.7-1.36l.82-1.96A.99.99 0 0 1 5.4 7.2l.33.14a.98.98 0 0 0 1.24-.32L9.31 3.4a.99.99 0 0 1 1.54.06l2.14 2.96a1 1 0 0 0 1.24.26l.53-.29a1 1 0 0 1 1.45.9l-.14 2.09a.99.99 0 0 0 .42.92 6.97 6.97 0 0 1 2.13 2.23.99.99 0 0 0 .8.45l1.88.08a1 1 0 0 1 .87 1.4l-.91 1.73a1 1 0 0 1-1.32.49l-.47-.21a.99.99 0 0 0-1.19.31L16 21a.99.99 0 0 1-1.55-.04l-1.68-2.52a1 1 0 0 0-1.08-.37l-.71.2a1 1 0 0 1-1.27-.83l-.06-.51a.98.98 0 0 0-.96-.81h-2.21a.98.98 0 0 0-.83.46l-.45.81a1 1 0 0 1-1.38.36l-.39-.23a1 1 0 0 1-.37-1.41l1.69-2.42a.99.99 0 0 0 0-1.1L3.1 11.54a.99.99 0 0 1 .13-1.26l.4-.36a1 1 0 0 1 1.41.05l1.38 1.54a1 1 0 0 0 .73.33h3.07a1 1 0 0 1 .51 1.87l-1.53.88a1 1 0 0 0-.49.66l-.33 1.33a1 1 0 0 1-1.17.76l-2.67-.42a1 1 0 0 0-1.02.44z"/>
      </svg>
    ),
    visitors: 1.5,
    revenues: "3,580",
    sales: 389,
    conversion: 2.5,
  },
  {
    name: "Gas",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm5 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm5 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
      </svg>
    ),
    visitors: 3.5,
    revenues: "6,768",
    sales: 390,
    conversion: 4.2,
  },
];

const TableOne = () => {
  const [glowingRows, setGlowingRows] = useState({});
  
  useEffect(() => {
    const interval = setInterval(() => {
      const randomRow = Math.floor(Math.random() * sourcesData.length);
      setGlowingRows({[randomRow]: true});
      
      setTimeout(() => {
        setGlowingRows({});
      }, 700);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="col-span-12 rounded-lg border border-sky-100 bg-white px-5 pb-2.5 pt-6 shadow-md xl:col-span-8">
    <h4 className="mb-6 text-xl font-semibold text-sky-800 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      Power Sources
    </h4>

    <div className="flex flex-col">
      <div className="grid grid-cols-3 rounded-t-lg bg-sky-50 sm:grid-cols-5">
        <div className="p-2.5 xl:p-5">
          <h5 className="text-sm font-medium uppercase text-sky-700">
            Source
          </h5>
        </div>
        <div className="p-2.5 text-center xl:p-5">
          <h5 className="text-sm font-medium uppercase text-sky-700">
            Output (GW)
          </h5>
        </div>
        <div className="p-2.5 text-center xl:p-5">
          <h5 className="text-sm font-medium uppercase text-sky-700">
            Revenue
          </h5>
        </div>
        <div className="hidden p-2.5 text-center sm:block xl:p-5">
          <h5 className="text-sm font-medium uppercase text-sky-700">
            Clients
          </h5>
        </div>
        <div className="hidden p-2.5 text-center sm:block xl:p-5">
          <h5 className="text-sm font-medium uppercase text-sky-700">
            Efficiency
          </h5>
        </div>
      </div>

      {sourcesData.map((source, key) => (
        <div
          className={`grid grid-cols-3 sm:grid-cols-5 transition-colors duration-300 ${
            key === sourcesData.length - 1 ? "" : "border-b border-sky-100"
          } ${glowingRows[key] ? "bg-sky-50" : ""}`}
          key={key}
        >
          <div className="flex items-center gap-3 p-2.5 xl:p-5">
            <div className="flex-shrink-0">
              {source.icon}
            </div>
            <p className="hidden font-medium text-sky-800 sm:block">
              {source.name}
            </p>
          </div>

          <div className="flex items-center justify-center p-2.5 xl:p-5">
            <p className="text-sky-800">{source.visitors}K</p>
          </div>

          <div className="flex items-center justify-center p-2.5 xl:p-5">
            <p className="text-emerald-500">${source.revenues}</p>
          </div>

          <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
            <p className="text-sky-800">{source.sales}</p>
          </div>

          <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
            <p className="text-blue-500">{source.conversion}%</p>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

export default TableOne;
