import React from "react";
import { Menu, MenuProps, Tooltip } from "antd";
import Image from "next/image";
import { useStore } from "@/context";
import logo from "../../public/logo.jpg";
import { useRouter } from "next/navigation";
import iconMain from "@/assets/icons/icon-main.svg";
import iconStatistical from "@/assets/icons/icon-statistical.svg";
import iconManage from "@/assets/icons/icon-manage.svg";
import iconNoti from "@/assets/icons/icon-noti.svg";
import iconSetting from "@/assets/icons/icon-setting.svg";

const dataSidebar = [
  { icon: iconMain, title: "Home", path: "/home" },
  { icon: iconStatistical, title: "Statistical", path: "/statistical" },
  { icon: iconManage, title: "Manage", path: "/manage" },
  { icon: iconNoti, title: "Notification", path: "/notification" },
  { icon: iconSetting, title: "Setting", path: "/setting" },
];
const Sidebar = () => {
  const { collapsed } = useStore();
  const router = useRouter();

  return (
    <div className="h-full w-full flex flex-col gap-2 bg-[#161A23] z-100">
      <div className="flex flex-col items-center justify-center pt-3">
        <span className="text-[10px] leading-3 font-[500] text-center text-[#757575]">MENU</span>
        {dataSidebar.slice(0,3).map((item, index) => (
          <div key={item.path} className="hover:bg-[#2D2F39] bg-transparent px-[12px] py-[10px] cursor-pointer rounded-lg" onClick={() => router.push(`${item.path}`)}>
          <Tooltip title={item.title} placement="right">
            <Image src={item.icon} alt="icon-main" />
          </Tooltip>
        </div>
        ))}
        
      </div>
      <div className="flex flex-col items-center justify-center">
        <span className="text-[10px] leading-3 font-[500] text-center text-[#757575]">SETTINGS</span>
        {dataSidebar.slice(3,5).map((item, index) => (
          <div key={item.path} className="hover:bg-[#2D2F39] bg-transparent px-[12px] py-[10px] cursor-pointer rounded-lg" onClick={() => router.push(`/${item.path}`)}>
          <Tooltip title={item.title} placement="right">
            <Image src={item.icon} alt="icon-main" />
          </Tooltip>
        </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
