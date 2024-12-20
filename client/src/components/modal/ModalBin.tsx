import { Modal } from "antd";
import Hls from "hls.js";
import React, { useEffect, useRef, useState } from "react";
import base64 from "@/assets/image.json";
interface ModalBinProps {
  visible: boolean;
  onCancel: () => void;
}
const base64Image = `data:image/png;base64,${base64.image}`;
const infoText = "Cháy";
const ModalBin: React.FC<ModalBinProps> = ({ visible, onCancel }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const setupWebRTC = async () => {
      const config = {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      };

      peerConnection.current = new RTCPeerConnection(config);

      peerConnection.current.ontrack = (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnection.current.onicecandidate = async (event) => {
        if (event.candidate) {
          await fetch("http://192.168.102.13/candidate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(event.candidate),
          });
        }
      };

      const createOffer = async () => {
        console.log("Sending offer request");

        // Fetch the offer from the server
        const offerResponse = await fetch("http://192.168.102.13/offer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sdp: "",
            type: "offer",
          }),
        });

        // Parse the offer response
        const offer = await offerResponse.json();
        console.log("Received offer response:", offer);

        // Set the remote description based on the received offer
        if (peerConnection.current) {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        }

        // Create an answer and set it as the local description
        if (peerConnection.current) {
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
        }

        // Send the answer to the server
        await fetch("http://192.168.102.13/answer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(peerConnection.current?.localDescription || {}),
        });
      };

      createOffer();
    };

    setupWebRTC();

    return () => {
      peerConnection.current?.close();
      peerConnection.current = null;
    };
  }, []);
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleImageModalClose = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <Modal open={visible} onCancel={onCancel} footer={null} width={600} height={500}>
        <div className="flex items-start justify-start gap-4">
          <div>
            <h1 className="text-black">WebRTC Stream</h1>
            <video ref={videoRef} controls autoPlay className="w-full" />
          </div>
          <div className="border-[1px] flex flex-col gap-2 w-full h-full ">
            <div className="flex justify-center items-center w-full">
              <div className="cursor-pointer text-center w-full text-[#868686]">
                Image
              </div>
              <div className="cursor-pointer text-center w-full text-[#868686]">
                Info
              </div>
            </div>
            <div className="flex flex-col gap-2 p-2 overflow-y-auto">
              {Array.from({ length: 15 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between gap-2 p-2">
                  <div className="relative">
                    <img
                      src={base64Image}
                      alt={`Image ${index + 1}`}
                      width={100}
                      height={100}
                      className="cursor-pointer"
                      onClick={() => handleImageClick(base64Image)}
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
                  <span className="mr-4">{infoText}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {selectedImage && (
        <Modal open={true} onCancel={handleImageModalClose} footer={null} width={800}>
          <div className="relative">
            <img src={selectedImage} alt="Selected" className="w-full h-auto" />
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
    </>
  );
};

export default ModalBin;
