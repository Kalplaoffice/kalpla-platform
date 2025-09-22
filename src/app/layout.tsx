import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AmplifyProvider } from '@/components/providers/AmplifyProvider';
import { NotificationProvider } from '@/components/notifications/NotificationProvider';
import { UserProvider } from '@/contexts/UserContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ClientOnly } from '@/components/layout/ClientOnly';

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

// Force dynamic rendering for all pages
export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
        suppressHydrationWarning={true}
      >
        <AmplifyProvider>
          <UserProvider>
            <NotificationProvider>
              <ClientOnly>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex flex-col">
                  <Navbar />
                  <main className="flex-1 w-full">
                    {children}
                  </main>
                  <Footer />
                </div>
              </ClientOnly>
            </NotificationProvider>
          </UserProvider>
        </AmplifyProvider>
      </body>
    </html>
  );
}
