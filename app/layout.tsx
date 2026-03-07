import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bubu Dudu Shopping List",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
