import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

import BottomNav from "@/components/BottomNav";

export const metadata = {
  title: "Trampou - A sua próxima grande oportunidade",
  description: "Plataforma web moderna de recrutamento e seleção",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col antialiased bg-neutral-50`}>
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
