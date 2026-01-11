import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wavy",
  description: "A simple text-based SNS where thoughts flow.",
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
