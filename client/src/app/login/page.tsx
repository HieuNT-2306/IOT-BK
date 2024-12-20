"use client";
import { login, register } from "@/api/user";
import ModalConfirm from "@/components/modal/ModalConfirm";
import { toastError, toastSuccess } from "@/utils/toast";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Page() {
  const [formatLogin, setFormatLogin] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const changeFormat = (format: string) => {
    if (formatLogin !== format) {
      setFormatLogin(format);
    }
    console.log(formatLogin);
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await register({ email, password, name });
      console.log("User registered successfully:", response);
      // Handle successful registration (e.g., redirect to login page)
    } catch (error) {
      console.error("Error registering user:", error);
      // Handle registration error
    }
  };
  const handleLogin = async () => {
    try {
      const response = await login( email, password );
      console.log("User registered successfully:", response);
      toastSuccess("Login successfully");
      router.push("/home");
      // Handle successful registration (e.g., redirect to login page)
    } catch (error) {
      console.error("Error registering user:", error);
      // Handle registration error
    }
  }
  return (
    <div className='bg-[url("/images/background.jpg")] bg-cover bg-no-repeat bg-center h-screen w-full overflow-hidden relative flex items-center justify-center'>
      <div className="absolute top-1/3 flex flex-col justify-start items-center gap-4 rounded-md p-4 w-1/6 shadow-lg bg-gray-100 bg-opacity-85">
        <div className="flex justify-between items-center w-full">
          <span
            onClick={() => changeFormat("login")}
            className={`cursor-pointer ${
              formatLogin === "login" ? "font-bold" : ""
            }`}
          >
            Login
          </span>
          <span
            onClick={() => changeFormat("register")}
            className={`cursor-pointer ${
              formatLogin === "register" ? "font-bold" : ""
            }`}
          >
            Register
          </span>
        </div>
        {formatLogin === "login" ? (
          <>
            <div className="border-[1px] border-zinc-600 rounded-md ">
              <input
                type="email"
                placeholder="Email"
                className="text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="border-[1px] border-zinc-600 rounded-md ">
              <input
                type="password"
                placeholder="Password"
                className="text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button onClick={handleLogin}>Login</Button>
          </>
        ) : (
          <>
            <div className="border-[1px] border-zinc-600 rounded-md ">
              <input
                type="text"
                placeholder="Name"
                className="text-black"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="border-[1px] border-zinc-600 rounded-md ">
              <input
                type="email"
                placeholder="Email"
                className="text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="border-[1px] border-zinc-600 rounded-md ">
              <input
                type="password"
                placeholder="Password"
                className="text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="border-[1px] border-zinc-600 rounded-md ">
              <input
                type="password"
                placeholder="Confirm Password"
                className="text-black"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button onClick={handleRegister}>Sign in</Button>
          </>
        )}
      </div>
      {isModalVisible && <ModalConfirm visible={isModalVisible} onCancel={handleCancel} />}
    </div>
  );
}
