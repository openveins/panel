import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { LoggerProvider } from "@/components/context/LoggerContext";
import { AuthProvider } from "@/components/context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Openveins",
  description: "Open-source game hosting and management panel for everyone!",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main>
          <TooltipProvider>
            <LoggerProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </LoggerProvider>
          </TooltipProvider>
        </main>
        <Toaster expand visibleToasts={10}/>
      </body>
    </html>
  );
}
