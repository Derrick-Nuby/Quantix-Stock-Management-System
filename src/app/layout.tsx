import { Crimson_Text, Roboto } from 'next/font/google';
import "./globals.css";
import Providers from "./providers";
import { generateMetadata, viewport } from "./metadata";

const crimsonText = Crimson_Text({
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-crimson',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export { generateMetadata, viewport };


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body
        className={`${crimsonText.variable} ${roboto.className} antialiased`}

      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
