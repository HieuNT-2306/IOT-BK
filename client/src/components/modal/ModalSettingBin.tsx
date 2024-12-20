import { Button, Modal } from "antd";
import React from "react";

interface ModalBinProps {
  visible: boolean;
  onCancel: () => void;
}

const ModalSettingBin: React.FC<ModalBinProps> = ({
  visible,
  onCancel,
}) => {
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      height={500}
    >
      <div>
        <span className="text-[20px] leading-6 font-[600] w-full text-center  inline-block">
          {" "}
          Bin Setting
        </span>
      </div>
      <div className="flex flex-col gap-1 ">
        <span className="text-[16px] leading-6 font-[600]">Bin Name</span>
        <input
          type="text"
          placeholder="Bin Name"
          className="bg-[#F3F3F3] text-black p-2 rounded-lg"
        />
      </div>
      <div className="flex flex-col gap-1 mt-4">
        <span className="text-[16px] leading-6 font-[600]">Link RTSP</span>
        <input type="text" placeholder="RTSP link" className="bg-[#F3F3F3] text-black p-2 rounded-lg"/>
      </div>
      <div className="flex flex-col gap-1 mt-4">
        <span className="text-[16px] leading-6 font-[600]">Destination</span>
        <input type="text" placeholder="Destination" className="bg-[#F3F3F3] text-black p-2 text-start h-20 rounded-lg"/>
      </div>
      
      <div className="flex items-center justify-end mt-4">
        <Button>Delete</Button>
        <Button className="bg-black text-white">Save</Button>
      </div>
    </Modal>
  );
};

export default ModalSettingBin;
