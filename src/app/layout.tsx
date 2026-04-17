import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import MagneticCursor from '@/components/MagneticCursor';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Tomris | Premium Digital Agency',
  description: 'A world-class modern SMM agency focused on social media strategy, visual direction, and elegant brand storytelling.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <MagneticCursor />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
