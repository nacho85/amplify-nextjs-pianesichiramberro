import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pianesi & Chiramberro | Productores Asesores de Seguros",
  description:
    "Pianesi & Chiramberro | Productores Asesores de Seguros - Oficina Representada de Zurich en Olavarría",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
