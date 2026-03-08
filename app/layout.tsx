import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Notification } from "@/components/ui/Notification";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "HerVoice — Anonymous Stories by Women",
  description:
    "A safe, anonymous platform for women to share their stories, find solidarity, and amplify each other's voices. No name. No face. Just truth.",
  keywords: ["women", "anonymous", "stories", "community", "support", "mental health"],
  openGraph: {
    title: "HerVoice",
    description: "Your story. Your power. Anonymous.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${jakarta.variable} font-sans bg-[#0a0a0f] text-white antialiased`}
      >
        <Notification />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
