"use client";
import React, { useState } from "react";
import { Button, DatePicker, Dropdown, Menu } from "antd";
import { DownOutlined } from '@ant-design/icons';
import ChartOver from "@/components/chart/chartOver";


const items = [
  { id: "1", label: "Thùng rác 1", path: "/bin/1" },
  { id: "2", label: "Thùng rác 2", path: "/bin/2" },
  { id: "3", label: "Thùng rác 3", path: "/bin/3" },
  { id: "4", label: "Thùng rác 4", path: "/bin/4" },
  { id: "5", label: "Thùng rác 5", path: "/bin/5" },
  { id: "6", label: "Thùng rác 6", path: "/bin/6" },
  { id: "7", label: "Thùng rác 7", path: "/bin/7" },
  { id: "8", label: "Thùng rác 8", path: "/bin/8" },
  { id: "9", label: "Thùng rác 9", path: "/bin/9" },
  { id: "10", label: "Thùng rác 10", path: "/bin/10" },
];
const tabBin = (id: string, ) => {
  return (
    <div className="flex flex-col gap-4 basis-[10%] text-black h-full border-r-[1px] px-4 border-[#c7c7c7]">
      <span> {id}</span>
    <ChartOver/>
    </div>
  )
}

const Page = () => {
  const [tab, setTab] = useState("1");

  const handleTabClick = (newTab: string) => {
    if (tab !== newTab) {
      setTab(newTab);
    }
  };
  return (
    <div className="flex items-start justify-start py-[25px] bg-[#f4f7fe]">
      <div className="flex flex-col gap-4 basis-[10%] text-black h-full border-r-[1px] px-4 border-[#c7c7c7]">
        <span className="text-[20px] leading-[21px] font-[700] ">Thống kê</span>
        {items.map((item) => (
          <span
            key={item.id}
            className={`text-[16px] leading-[21px] font-[400] ${
              tab === item.id ? "bg-[#C5C9CE]" : "hover:bg-[#ebeced]"
            } p-4 rounded-xl cursor-pointer`}
            onClick={() => handleTabClick(item.id)}
          >
            {item.label}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-4 w-full h-full px-4">
        {tabBin(tab)}
      </div>
    </div>
  );
};

export default Page;
