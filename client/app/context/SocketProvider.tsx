"use client";
import { initializeSocket, disconnectSocket } from "@/app/utils/socket";
import { useEffect } from "react";

export const SocketProvider = ({ children }: { children: any }) => {
  useEffect(() => {
    initializeSocket();
    console.log("teogeag")
    return () => {
      disconnectSocket();
    };
  }, []);

  return <>{children}</>;
};