'use client'
import React, { useState } from 'react';
import ModalBin from '@/components/modal/ModalBin';

const Page = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="text-center text-2xl h-[90vh] bg-white text-black">
      <h1>Video Page</h1>
      <button onClick={showModal} className="mt-4 p-2 bg-blue-500 text-white rounded">
        Open Bin Modal
      </button>
      {isModalVisible && <ModalBin visible={isModalVisible} onCancel={handleCancel} />}
    </div>
  );
}

export default Page;