import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AmplifyProvider } from '@/components/providers/AmplifyProvider';
import { NotificationProvider } from '@/components/notifications/NotificationProvider';
import { UserProvider } from '@/contexts/UserContext';
import { Navbar } from '@/components/layout/Navbar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kalpla - EdTech Platform",
  description: "Learn, grow, and succeed with Kalpla's comprehensive educational platform",
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
        <AmplifyProvider>
          <UserProvider>
            <NotificationProvider>
              <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                  {children}
                </main>
              </div>
            </NotificationProvider>
          </UserProvider>
        </AmplifyProvider>
      </body>
    </html>
  );
}
