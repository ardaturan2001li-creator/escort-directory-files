import type { Metadata } from 'next';
import AgeVerificationModal from '@/components/AgeVerificationModal';
import './globals.css';

export const metadata: Metadata = {
  title: 'Global Escort Directory - Verified International Companions',
  description: 'Explore verified independent escorts and VIP agencies worldwide.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  other: {
    'rating': 'RTA-5042-1996-1400-1574-JUR',
    'RTA': 'RTA-5042-1996-1400-1574-JUR',
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#08080a] text-slate-200 antialiased selection:bg-red-600 selection:text-white">
        <AgeVerificationModal />
        {children}
      </body>
    </html>
  );
}
