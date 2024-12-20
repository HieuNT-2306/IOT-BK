"use client";
import { getProfile } from "@/api/user";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

const storeContext = createContext<any>(null);

export const useStore = () => useContext(storeContext);

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [showHeader, setShowHeader] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [collapsed, setCollapsed] = useState(true);
  const [profile, setProfile] = useState({});
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/login") {
      setShowHeader(false);
      setShowSidebar(false);
    } else {
      setShowHeader(true);
      setShowSidebar(true);
    }
  }, [pathname]);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setProfile(response);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  

  return (
    <storeContext.Provider
      value={{ showHeader, setShowHeader, showSidebar, setShowSidebar,collapsed, toggleCollapsed, profile }}
    >
      {children}
    </storeContext.Provider>
  );
};

export default StoreProvider;
