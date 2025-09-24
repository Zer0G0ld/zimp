// src/app/layout.tsx
import type { Metadata } from "next";
import { ThemeProvider } from "../context/ThemeContext";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "ZIMP",
  description: "Sistema de monitoramento inteligente",
  icons: {
    icon: "/zimp.ico",
    shortcut: "/zimp.png",
    apple: "/zimp.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeProvider>
          <div className="app-container">
            <Sidebar />
            <div className="main-content">
              <main>{children}</main>
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
