"use client";
import { getBin, getProfile } from "@/api/user";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

const storeContext = createContext<any>(null);

export const useStore = () => useContext(storeContext);

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [showHeader, setShowHeader] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [collapsed, setCollapsed] = useState(true);
  const [profile, setProfile] = useState({});
  const [bin, setBin] = useState({});
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
       // const response = await getProfile();
       // setProfile(response);
       const responseBin = await getBin();
       setBin(responseBin);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
    const intervalId = setInterval(fetchProfile, 100000); // Gọi lại hàm fetchProfile mỗi 100 giây

    return () => clearInterval(intervalId);
  }, []);



  

  return (
    <storeContext.Provider
      value={{ showHeader, setShowHeader, showSidebar, setShowSidebar,collapsed, toggleCollapsed, profile, bin}}
    >
      {children}
    </storeContext.Provider>
  );
};

export default StoreProvider;
