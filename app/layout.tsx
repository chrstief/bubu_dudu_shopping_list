import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "./client-providers";

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
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
