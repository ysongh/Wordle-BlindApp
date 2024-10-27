import type { Metadata } from "next";
import "./globals.css";
import { ClientWrapper } from "./components/ClientWrapper";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Create Nillion App",
  description: "Quickstart a Nillion fullstack app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
