import { Avatar, Badge, Button, Dropdown, MenuProps, Space } from "antd";
import React, { useState } from "react";
import logo from "@/assets/icons/logo.svg";
import logoDefault from "../../public/logo.jpg";
import Image from "next/image";
import iconNoti from "@/assets/icons/icon-noti-header.svg";
import iconInfo from "@/assets/icons/icon-info-header.svg";
import iconSearch from "@/assets/icons/icon-search-header.svg";
import { useStore } from "@/context";
import { toastSuccess } from "@/utils/toast";
import { useRouter } from "next/navigation";

const Header = () => {
  const { collapsed, toggleCollapsed, profile } = useStore();
  const [dropdownOpen, setDropdownOpen] = useState();
  const router = useRouter();
  const handleLogout = () => {
    //Cookies.remove(GOOGLE_COOKIE_NAME);
    router.push("/home");
    toastSuccess("Logout successfully");
  };

  const items: MenuProps["items"] = [
    {
      label: "Profile",
      key: "1",
    },
    {
      label: "Setting",
      key: "2",
    },
    {
      label: "Logout",
      key: "3",
      onClick: handleLogout,
    },
  ];

  const handleMenuClick = (open: any) => {
    setDropdownOpen(open);
  };

  return (
    <div className="flex w-screen h-[6vh] border-b-[1px] border-[#c7c7c7] fixed items-center top-0 right-0 justify-between bg-[#F4F7FE] px-[24px] shadow-b-lg">
      <div className="flex items-center justify-start gap-2">
        <Image src={logo} alt="logo" />
        <span className="text-[32.67px] text-[#181818] font-[300] leading-[45.73px] "><span className="text-[#181818] text-[32.67px] font-[700] leading-[45.73px]">VICAM</span> AI</span>
      </div>
      <div className="relative flex items-center justify-end gap-5">
        <div className="bg-white">
          <input placeholder="Search..." className="pl-[30px] bl"/>
          <Image
            src={iconSearch}
            alt="icon-search"
            style={{
              position: "absolute",
              left: "5px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
        </div>
        <Image src={iconNoti} alt="icon-noti" />
        <Image src={iconInfo} alt="icon-info" />
        <Image src={profile?.avatar || logoDefault} width={41} height={41} alt="avatar" className="rounded-full" />
      </div>
    </div>
  );
};

export default Header;
