"use client";
import React, { useEffect, useState } from "react";
import image from "../../public/logo.jpg";
import iconWarning from "@/assets/icons/icon-warning.svg";
import { Button, DatePicker, Modal } from "antd";
import Image, { StaticImageData } from "next/image";
import { useStore } from "@/context";
import ModalSettingBin from "@/components/modal/ModalSettingBin";
import dynamic from 'next/dynamic'
const DynamicMap = dynamic(() => import('@/components/map/map'), {
  ssr: false,
})
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
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleImageClick = () => {
    if (!isEditing) {
      setIsModalVisible(true);
    }
  };

  const handleLargeClick = (image: StaticImageData) => {
    setSelectedImage(image);
  };

  const handleImageModalClose = () => {
    setSelectedImage(null);
  };

  // Xử lý khi người dùng chọn file ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setImageSrc(event.target.result as string); // Lưu URL của ảnh
        }
      };
      reader.readAsDataURL(file); // Đọc file dưới dạng URL
    }
  };

  // Xử lý khi người dùng click vào ảnh để thêm marker
  const handleAddMarker = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; // Tính tọa độ X tương đối với ảnh
    const y = e.clientY - rect.top; // Tính tọa độ Y tương đối với ảnh

    // Thêm marker vào danh sách
    setMarkers([...markers, { x, y }]);
  };

  // Xử lý khi người dùng click vào marker để xóa nó
  const handleRemoveMarker = (indexToRemove) => {
    setMarkers(markers.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="flex flex-col gap-2 bg-[#F4F7FE] px-[65px] py-[25px] ">
      <span className="text-[14px] leading-6 font-[500] text-[#2B3674]">
        VICAM AI
      </span>
      <span className="text-black font-[700] text-[48px] leading-[42px] ">
        Homepage
      </span>
      <div className="flex items-center justify- w-full bg-white rounded-lg px-1 py-2">
        <div>
          {" "}
          <DatePicker />
        </div>
        <div>
          {" "}
          <DatePicker />
        </div>
      </div>
      <div className="flex items-start gap-6 w-full">
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
          <div className="w-full h-96">
          <DynamicMap />
          </div>
          <Button
            className="font-[600] text-[14px] leading-6 text-white bg-[#161A23] w-[140px]"
            onClick={showModal}
          >
            EDIT MAP
          </Button>
        </div>
        <div className="flex flex-col gap-2 p-2 overflow-y-auto flex-1 h-96 shadow-lg bg-[#f6f6f6] rounded-lg">
          <div className="flex justify-between w-full">
            <span className="text-[#1B2559] text-[20px] leading-8 font-[700]">
              Kết quả nhận diện đối tượng
            </span>
            <Button className="bg-black rounded-xl font-[600] text-[14px] leading-6 text-white">
              Tất cả
            </Button>
          </div>
          <div className="overflow-y-auto h-96 flex flex-col gap-2">
            {Array.from({ length: 15 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg shadow-lg "
              >
                <div className="relative">
                  <Image
                    src={image}
                    alt={`Image ${index + 1}`}
                    width={100}
                    height={100}
                    className="cursor-pointer"
                    onClick={() => handleLargeClick(image)}
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
                <div className="flex">
                  <Image src={iconWarning} alt="Image" width={18} height={18} />
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
      {selectedImage && (
        <Modal
          open={true}
          onCancel={handleImageModalClose}
          footer={null}
          width={800}
          closeIcon={false}
        >
          <div className="relative">
            <Image
              src={selectedImage}
              alt="Selected"
              className="w-full h-auto"
            />
            {rectangle && (
              <div
                className="absolute border-2 border-red-500"
                style={{
                  left: `${rectangle.xA}px`,
                  top: `${rectangle.yA}px`,
                  width: `${rectangle.xB - rectangle.xA}px`,
                  height: `${rectangle.yB - rectangle.yA}px`,
                }}
              ></div>
            )}
          </div>
        </Modal>
      )}
      {isModalVisible && (
        <ModalSettingBin visible={isModalVisible} onCancel={handleCancel} />
      )}
    </div>
  );
};

export default Page;
