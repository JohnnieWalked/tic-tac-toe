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
// import '../styles/styles.scss';

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
    // Extra attributes from the server: class,style - to avoid this error -> added suppressHydrationWarning
    <html suppressHydrationWarning lang="en">
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
