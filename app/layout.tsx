import type { Metadata } from "next";
import { Mukta } from "next/font/google";
import "./globals.css";

const mukta = Mukta({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-mukta",
});

export const metadata: Metadata = {
  title: "Landing Page Conciliadora",
  description: "Calculadora de taxas e economia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${mukta.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
