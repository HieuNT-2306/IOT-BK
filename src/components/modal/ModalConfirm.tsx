import { activeCode } from "@/api/user";
import { toastError } from "@/utils/toast";
import { Button, Modal } from "antd";
import Hls from "hls.js";
import React, { useEffect, useRef, useState } from "react";
interface ModalConfirmProps {
  visible: boolean;
  onCancel: () => void;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({ visible, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [code, setCode] = useState("");

  const handCheckCode = async () => {
    if (!code) {
      toastError("Please enter code");
      return;
    }
    try {
      activeCode(code);
    } catch (error) {
      console.error("Error active code:", error);
      throw error;
    }
  };

  return (
    <Modal open={visible} onCancel={onCancel} footer={null}>
      <div>
        <h1 className="text-black">Confirm form</h1>
        <div className="border-[1px] border-zinc-600 rounded-md ">
          <input
            type="text"
            placeholder="code"
            className="text-black"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <Button
          onClick={async () => {
            await handCheckCode(); 
            onCancel();
          }}
        > 
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

export default ModalConfirm;
