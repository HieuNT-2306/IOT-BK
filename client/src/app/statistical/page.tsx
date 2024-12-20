"use client";
import Image, { StaticImageData } from "next/image";
import React, { useState } from "react";
import iconWarning from "@/assets/icons/icon-warning.svg";
import logoImage from "../../../public/logo.jpg";
import { Button, DatePicker, Dropdown, Menu } from "antd";
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';

const { RangePicker } = DatePicker;
const Page = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tab, setTab] = useState("Trực tiếp");
  const [dates, setDates] = useState<[moment.Moment, moment.Moment] | null>(null);
  const [selectedImage, setSelectedImage] = useState<
    string | StaticImageData | null
  >(null);

  const items = [
    { key: "1", label: "Option 1" },
    { key: "2", label: "Option 2" },
    { key: "3", label: "Option 3" },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const [rectangle, setRectangle] = useState<{
    xA: number;
    yA: number;
    xB: number;
    yB: number;
  } | null>({
    xA: 50,
    yA: 50,
    xB: 150,
    yB: 150,
  });
  const handleLargeClick = (image: StaticImageData) => {
    setSelectedImage(image);
  };

  const handleImageModalClose = () => {
    setSelectedImage(null);
  };
  const handleTabClick = (newTab: string) => {
    if (tab !== newTab) {
      setTab(newTab);
    }
  };
  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    setDates(dates);
  };
  return (
    <div className="flex items-start justify-start py-[25px] bg-[#f4f7fe]">
      <div className="flex flex-col gap-4 basis-[10%] text-black h-full border-r-[1px] px-4 border-[#c7c7c7]">
        <span className="text-[20px] leading-[21px] font-[700] ">Thống kê</span>
        <span
          className={`text-[16px] leading-[21px] font-[400] ${
            tab === "Trực tiếp" ? "bg-[#C5C9CE]" : "hover:bg-[#ebeced]"
          } p-4 rounded-xl cursor-pointer`}
          onClick={() => handleTabClick("Trực tiếp")}
        >
          {" "}
          Trực tiếp
        </span>
        <span
          className={`text-[16px] leading-[21px] font-[400] ${
            tab === "Lịch sử" ? "bg-[#C5C9CE]" : "hover:bg-[#ebeced]"
          } p-4  rounded-xl cursor-pointer`}
          onClick={() => handleTabClick("Lịch sử")}
        >
          {" "}
          Lịch sử{" "}
        </span>
      </div>
      {tab === "Trực tiếp" && (
        <div className="flex flex-col flex-1 items-center justify-start p-2 ">
          <div className="flex items-center justify-start text-left">
            <span className="text-[14px] leading-[24px] font-[600] text-[#8F96B9] w-full inline-flex">
              Thống kê &gt; <a className="text-[#2b3674] font-[700]">{tab}</a>
            </span>
          </div>
          <span className="text-[48px] leading-[42px] font-[700] text-black text-left">
            {tab}
          </span>
          <div className="flex items-center justify-start gap-4">
            <div className="bg-white rounded-2xl flex flex-col gap-2  ">
              {/* <Image src={"/logo.jpg"} alt='MapSRC' width={850} height={355} className='rounded-lg' /> */}
              <div className="bg-white rounded-2xl w-[838px] h-[355px]"> </div>
              <span className="text-[24px] leading-[32px] font-[700] text-black">
                LINK RTSP
              </span>
              <input
                placeholder="rtsp://:..."
                className="p-4 border-[1px] border-[#C5C9CE] rounded-xl"
              ></input>
              <span className="text-[24px] leading-[32px] font-[700] text-black ">
                Các chức năng AI đã được bật
              </span>
              <input
                placeholder="Mô tả"
                className="p-4 border-[1px] border-[#C5C9CE] rounded-xl"
              ></input>
            </div>
            <div className="bg-white rounded-2xl h-[355px]">
              <div className="overflow-y-auto h-96 flex flex-col gap-2">
                {Array.from({ length: 15 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-start gap-2 p-2 bg-white rounded-lg shadow-lg "
                  >
                    <div className="relative">
                      <Image
                        src={"/logo.jpg"}
                        alt={`Image ${index + 1}`}
                        width={100}
                        height={100}
                        onClick={() => handleLargeClick(logoImage)}
                      />
                      {rectangle && (
                        <div
                          className="absolute border-2 border-red-500"
                          style={{
                            left: `${rectangle.xA / 8}px`, // Adjust for smaller image
                            top: `${rectangle.yA / 8}px`, // Adjust for smaller image
                            width: `${(rectangle.xB - rectangle.xA) / 8}px`, // Adjust for smaller image
                            height: `${(rectangle.yB - rectangle.yA) / 8}px`, // Adjust for smaller image
                          }}
                        ></div>
                      )}
                    </div>
                    <div className="flex flex-col items-center justify-start gap-2">
                      <span className="text-[#1B2559] text-[16px] leading-[16px] font-[700] w-full">
                        Lớp1A2
                      </span>
                      <span className="text-[#A3AED0] text-[14px] leading-[20px] font-[400]">
                        GVCN: Nguyễn Văn A
                      </span>
                    </div>
                    <div className="flex px-16 ">
                      <Image
                        src={iconWarning}
                        alt="Image"
                        width={18}
                        height={18}
                      />
                      <span className="text-[#ff0000] text-[16px] leading-[20px] font-[700]">
                        Cháy
                      </span>
                    </div>
                    <div className="text-[#242634] text-[20px] leading-6 font-[400]">
                      10:05:33 10-11-2024
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {tab === "Lịch sử" && (
        <div className="flex flex-col flex-1 items-center justify-start p-6 ">
          <div className="flex items-center justify-start text-left">
            <span className="text-[14px] leading-[24px] font-[600] text-[#8F96B9] w-full inline-flex">
              Thống kê &gt; <a className="text-[#2b3674] font-[700]">{tab}</a>
            </span>
          </div>
          <span className="text-[48px] leading-[42px] font-[700] text-black text-left">
            {tab}
          </span>
          <div className="flex flex-col items-center justify-center bg-white w-full p-4">
            <div className="flex items-center justify-start gap-6 bg-white rounded-2xl w-full text-[16px] leading-6 font-[400] ">
              <Dropdown menu={{ items }} trigger={["click"]} className="border-[1px] border-[#ededed] basis-[26%] text-[16px] leading-6 font-[400]">
                <Button className="p-4 py-6 w-full">Actions <DownOutlined/></Button>
              </Dropdown>
              <Dropdown menu={{ items }} trigger={["click"]} className="border-[1px] border-[#ededed] basis-[26%] text-[16px] leading-6 font-[400]">
                <Button className="p-4 py-6 w-full">Bin <DownOutlined/></Button>
              </Dropdown>
              <RangePicker onChange={handleDateChange} className="border-[1px] py-3 h-full border-[#ededed] w-full basis-[26%] text-[16px] leading-6 font-[400]"/>
              <Button className="p-4 py-6 w-full border-[1px] bg-black border-[#ededed] text-white flex-1 text-[16px] leading-6 font-[400]">Tìm kiếm</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
