import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Profile Audit — Make your first impression count",
  description: "A thoughtful, client-style review workspace for X profiles. Score the profile photo, banner, bio and pinned post.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
