import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import { RecentPosts } from "./_components/RecentPosts";
import UserNavComp from "@/components/UserNav";
import { Toast } from "@/hooks/useToast";

const geistSans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Pixtrends",
    template: "%s | Pixtrends",
  },
  description:
    "Pixtrends is a platform for sharing and discovering the latest trends in photography, art, and design.",
  keywords: [
    "Pixtrends",
    "photography",
    "art",
    "design",
    "trends",
    "community",
    "sharing",
    "discovering",
    "inspiration",
    "creativity",
    "visual storytelling",
    "photographers",
    "artists",
    "designers",
  ],
  openGraph: {
    title: "Pixtrends",
    description:
      "Pixtrends is a platform for sharing and discovering the latest trends in photography, art, and design.",
    url: "https://www.pixtrends.vercel.app",
    siteName: "Pixtrends",
    type: "website",
    images: [
      {
        url: "/pixtrends-og.webp",
        width: 300,
        height: 300,
        alt: "Pixtrends - Photography, Art & Design Trends",
      },
    ],
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} font-geist bg-foreground overflow-x-hidden antialiased`}
      >
        <Nav>
          <UserNavComp />
        </Nav>
        <div className="flex">
          <div className="xsm:block xsm:w-[90px] sticky hidden h-dvh shrink-0 md:w-[200px]"></div>
          <main className="w-full">
            {children} {modal}
          </main>
          <RecentPosts />
        </div>
        <footer className="mb-25"></footer>
        <Toast />
      </body>
    </html>
  );
}
