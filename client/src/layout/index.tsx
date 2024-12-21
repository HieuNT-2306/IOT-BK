"use client";

import Loading from "@/app/loading";
import { useStore } from "@/context";
import useMounted from "@/hooks/useMounted";
import React, { ReactNode, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children }: { children: ReactNode }) => {
  const { isMounted } = useMounted();
  const { showHeader, showSidebar } = useStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen">
    {!isMounted && <Loading />}

      <div className="h-[7vh] w-full">
        <Header />
      </div>
    
    <div className="flex flex-row h-[93vh]">
      {showSidebar && (
        <div className="h-full w-[4vw]">
          <Sidebar />
        </div>
      )}
      <div className="flex-grow h-full">
        {children}
      </div>
    </div>
  </div>
  );
};

export default Layout;
