"use client";
import React, { useEffect, useState } from "react";
import image from "../../public/logo.jpg";
import iconWarning from "@/assets/icons/icon-warning.svg";
import { Button, DatePicker, Modal } from "antd";
import Image, { StaticImageData } from "next/image";
import { useStore } from "@/context";
import ModalSettingBin from "@/components/modal/ModalSettingBin";
import dynamic from "next/dynamic";
import Map from "@/components/map";

const dynamicMap = dynamic(() => import("@/components/map"), { ssr: false });

const AnyReactComponent = ({
  lat,
  lng,
  text,
}: {
  lat: number;
  lng: number;
  text: string;
}) => <div>{text}</div>;
const Page = () => {
  const [markers, setMarkers] = useState([]);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<
    string | StaticImageData | null
  >(null);
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };
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

  const { profile } = useStore();
  console.log(profile);
  useEffect(() => {
    if (profile?.map) {
      setImageSrc(profile?.map?.url);
      console.log(profile?.map);
      console.log(imageSrc);
    }
  }, [profile]);

  return (
    <div className="flex flex-col gap-2 bg-[#F4F7FE] px-[65px] py-[25px] h-full ">
      <span className="text-[14px] leading-6 font-[500] text-[#2B3674]">
        SMART BIN 
      </span>
      <span className="text-black font-[700] text-[48px] leading-[42px] ">
        Homepage
      </span>
      
      <div className="flex items-start gap-6 w-full pt-4">
        <div className="flex flex-col gap-3 basis-[55%]">
          {imageSrc && (
            <Image
              src={imageSrc}
              alt="MapSRC"
              width={850}
              height={500}
              className="rounded-lg"
            />
          )}
          <div className="w-full h-[600px]">
            <Map />
          </div>
        </div>
        <div className="flex flex-col gap-2 p-2 overflow-y-auto h-[600px] flex-1 shadow-lg bg-[#f6f6f6] rounded-lg">
          <div className="flex justify-between w-full">
            <span className="text-[#1B2559] text-[20px] leading-8 font-[700]">
              Trạng thái các thùng rác
            </span>
          </div>
          <div className="overflow-y-auto flex flex-col gap-2">
            {Array.from({ length: 15 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg shadow-lg "
              >
        
                <div className="flex flex-col items-center justify-start gap-2">
                  <span className="text-[#1B2559] text-[16px] leading-[16px] font-[700] w-full">
                    Thùng rác 1 
                  </span>
                  <span className="text-[#A3AED0] text-[14px] leading-[20px] font-[400]">
                    Địa chỉ: Thanh Xuân, Hà Nội 
                  </span>
                </div>
                <div className="flex">
                  <Image src={iconWarning} alt="Image" width={18} height={18} />
                  <span className="text-[#ff0000] text-[16px] leading-[20px] font-[700]">
                    46%
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
  );
};

export default Page;
