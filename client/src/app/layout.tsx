import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/custom.scss";
import Layout from "@/layout";
import StoreProvider from "@/context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VCamAI",
  description: "Bin AI App _ Computer Vision App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white`}>
        <StoreProvider>
          <Layout> {children} </Layout>
        </StoreProvider>
      </body>
    </html>
  );
}
