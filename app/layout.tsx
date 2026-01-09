import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Meme Generator',
  description: 'Create and share memes with friends',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
