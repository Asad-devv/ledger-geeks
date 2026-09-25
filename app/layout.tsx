import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import BackgroundFlow from '@/components/BackgroundFlow';
import CustomCursor from '@/components/CustomCursor';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-jetbrains-mono' });

export const metadata: Metadata = {
  title: 'Ledger Geeks — Blockchain & AI Engineering',
  description: 'Ledger Geeks designs, builds, and scales blockchain and AI-driven products for startups and businesses worldwide.',
  applicationName: 'Ledger Geeks',
  openGraph: { siteName: 'Ledger Geeks', type: 'website', locale: 'en_US' },
  twitter: { card: 'summary' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // data-scroll-behavior lets Next.js pause the smooth scrolling set in globals.css
    // during route changes, so page transitions land at the top instantly
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} data-scroll-behavior="smooth">
      <body>
        <BackgroundFlow />
        <div className="grain"></div>
        {children}
        <CustomCursor />
      </body>
    </html>
  );
}
