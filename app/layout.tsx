import type {Metadata} from 'next';
import { Urbanist, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'Teori Komputasi: UAS Masterclass',
  description: 'A responsive, interactive glassmorphic slide deck for the Theory of Computation Final Exam prep.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id" className={`${urbanist.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer"
        />
      </head>
      <body suppressHydrationWarning className="bg-[#0f172a] text-slate-100 font-sans antialiased min-h-screen overflow-x-hidden selection:bg-[#00f2fe]/30 selection:text-[#00f2fe]">
        {children}
      </body>
    </html>
  );
}
