import type { Metadata } from 'next';
import { cn } from '@/lib/utils';

/* providers */
import { ThemeProvider } from '@/providers/ThemeProvider';

/* components */
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';

/* styles */
import { Inter as FontSans } from 'next/font/google';
import './globals.css';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Tic-tac-toe',
  description: 'Tic-tac-toe multiplayer. Developed by JW.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="container pt-10">{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
