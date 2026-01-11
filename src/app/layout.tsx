import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Micro-SNS",
  description: "A simple text-based SNS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
