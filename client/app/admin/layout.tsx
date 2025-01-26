"use client";
import React, { useState, ReactNode } from "react";
import Sidebar from "@/app/components/Sidebar/index";
import Header from "@/app/components/Header";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const routes = [
    {
      layout: "/admin",
      path: "/dashboard",
      name: "Dashboard",
      icon: "fas fa-tachometer-alt text-blue", // Example Font Awesome icon
    },
    {
      layout: "/admin",
      path: "/categories",
      name: "Categories",
      icon: "fas fa-cogs text-blue",
    },
    {
      layout: "/admin",
      path: "/products",
      name: "Products",
      icon: "fas fa-box text-blue",
    },
    {
      layout: "/admin",
      path: "/announcements",
      name: "Announcements",
      icon: "fas fa-flag text-blue",
    },
    {
      layout: "/admin",
      path: "/users",
      name: "Users",
      icon: "fas fa-users text-blue",
    },
    {
      layout: "/admin",
      path: "/orders",
      name: "Orders",
      icon: "fas fa-boxes text-blue",
    },
    {
      layout: "/",
      path: "/",
      name: "Home",
      icon: "fas fa-home text-blue",
    },
  ];

  
  return (
    <>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      
      <div className="flex relative ">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col lg:ml-72.5">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}
