import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata = {
  title: 'Notes App',
  description: 'Offline-First Notes App with Sync',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${poppins.variable} antialiased`}>{children}</body>
    </html>
  );
}
