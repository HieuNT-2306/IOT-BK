import axiosInstance from "./config";
import CryptoJS from "crypto-js";

interface RegisterParams {
  email: string;
  password: string;
  name: string;
}

const setWithExpiry = (key: string, value: string, ttl: number) => {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
  console.log("Set item:", item);
};

const getWithExpiry = (key: string) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};

const setAuthToken = (token: string) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const part = parts.pop();
    if (part) {
      return part.split(';').shift();
    }
  }
}

export const register = async ({ email, password, name }: RegisterParams) => {
  const response = await axiosInstance.post("/auth/register", {
    email,
    password,
    name,
  });
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Secret key is not defined");
  }
  const encryptedUserId = CryptoJS.AES.encrypt(
    response?.data?._id,
    secretKey
  ).toString();
  setWithExpiry("userId", encryptedUserId, 5 * 60 * 1000);
  console.log(response.data);
  return response.data;
};

export const activeCode = async (code: string) => {
  const encryptedUserId = getWithExpiry("userId"); // Lấy userId đã mã hóa từ localStorage
  if (!encryptedUserId) {
    throw new Error("User ID not found or expired");
  }
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Secret key is not defined");
  }
  const bytes = CryptoJS.AES.decrypt(encryptedUserId, secretKey);
  const userId = bytes.toString(CryptoJS.enc.Utf8);
  const response = await axiosInstance.post("/auth/check-code", {
    _id: userId,
    code: code,
  });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", {
    username: email,
    password,
  });
  document.cookie = `token=${response?.data?.access_token}; path=/; max-age=86400`;
  return response?.data;
};

// export const getProfile = async () => {
//   setAuthToken(getCookie("token") || "");
//   const response = await axiosInstance.get("/users/get-profile");
//   return response?.data;
// };