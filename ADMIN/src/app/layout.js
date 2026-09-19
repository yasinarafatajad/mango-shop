import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Sidebar from '../components/layout/Sidebar';
import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';
import { AuthProvider } from '@/contexts/AuthContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'GadgetLife',
  description: 'GadgetLife | a modern ecommerce gadget website',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="flex">
            {/* sidebar component */}
            <Sidebar />

            {/* main component */}
            <main className="w-full flex flex-col">
              {/* dynamic components */}
              {children}
            </main>
          </div>
          {/* bottom navbar for mobile */}
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
