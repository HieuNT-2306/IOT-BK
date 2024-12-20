import React, { useEffect, useRef, useState } from "react";
import { PushpinOutlined } from "@ant-design/icons";
import { useStore } from "@/context";
import ModalBin from "@/components/modal/ModalBin";
import base64 from "@/assets/image.json";
import { Modal } from "antd";

const base64Image = `data:image/png;base64,${base64.image}`;
const infoText = "Cháy";

const Page = () => {
  // State để lưu danh sách các vị trí marker
  const [markers, setMarkers] = useState([]);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
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

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleLargeClick = (image: string) => {
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

  // Xử lý lưu các vị trí markers
  const handleSaveMarkers = () => {
    const dataStr = JSON.stringify(markers);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "markers.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

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
  
      const signalingSocket = new WebSocket("ws://localhost:5000/socket.io/?EIO=4&transport=websocket");
  
      signalingSocket.onopen = async () => {
        if (peerConnection.current) {
          const offer = await peerConnection.current.createOffer();
          await peerConnection.current.setLocalDescription(offer);
          signalingSocket.send(JSON.stringify({ type: "offer", sdp: offer.sdp }));
        }
      };
  
      signalingSocket.onmessage = async (message) => {
        const { type, sdp, candidate } = JSON.parse(message.data);
        if (type === "answer" && peerConnection.current) {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription({ sdp, type }));
        } else if (type === "ice-candidate" && peerConnection.current) {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      };
  
      signalingSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
  
      signalingSocket.onclose = () => {
        console.log("WebSocket connection closed");
      };
  
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          signalingSocket.send(JSON.stringify({ type: "ice-candidate", candidate: event.candidate }));
        }
      };
    };
  
    setupWebRTC();
  
    return () => {
      peerConnection.current?.close();
      peerConnection.current = null;
    };
  }, []);

  return (
    <div className="text-center text-2xl h-full  bg-white text-black">
      <div>
        {!imageSrc ? (
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={""}
          />
        ) : (
          <div className="flex gap-2 items-center justify-center p-2">
            <div className="flex flex-col gap-2 items-center w-[150%]">
              <div className="relative inline-block" onClick={handleAddMarker}>
                {/* Hiển thị ảnh đã tải lên */}
                <img
                  src={imageSrc}
                  alt="Uploaded map"
                  className="max-w-full h-auto"
                />
                {isEditing && (
                  <>
                    <div className="absolute top-0 left-0 bg-red-500 text-white p-1">
                      Editing...
                    </div>
                  </>
                )}

                {/* Render các markers trên ảnh */}
                {markers.map((marker, index) => (
                  <div
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn không cho sự kiện click trên ảnh kích hoạt
                      handleRemoveMarker(index);
                    }}
                    className="absolute cursor-pointer"
                    style={{
                      left: marker.x + 8 + "px",
                      top: marker.y + 8 + "px",
                      transform: "translate(-50%, -100%)", // Điều chỉnh vị trí của icon pin để mũi nhọn ở vị trí chính xác
                    }}
                  >
                    {/* Hiển thị icon pin */}
                    <PushpinOutlined
                      style={{ fontSize: "24px", color: "#FF0000" }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button
                  onClick={handleEditToggle}
                  className="p-2 bg-blue-500 text-white rounded"
                >
                  {isEditing ? "Stop Editing" : "Edit Map"}
                </button>
                {isEditing && (
                  <>
                    <button
                      onClick={handleSaveMarkers}
                      className="ml-2 p-2 bg-green-500 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setMarkers([])}
                      className="ml-2 p-2 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 p-2 overflow-y-auto w-full h-96 border-2 border-cyan-950">
              {Array.from({ length: 15 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 p-2"
                >
                  <div className="relative">
                    <img
                      src={base64Image}
                      alt={`Image ${index + 1}`}
                      width={100}
                      height={100}
                      className="cursor-pointer"
                      onClick={() => handleLargeClick(base64Image)}
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
        )}
      </div>
      <ModalBin visible={isModalVisible} onCancel={handleModalClose} />
      {selectedImage && (
        <Modal
          open={true}
          onCancel={handleImageModalClose}
          footer={null}
          width={800}
          closeIcon={false}
        >
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
    </div>
  );
};

export default Page;
