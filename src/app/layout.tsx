import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Anderson Magalhaes - Software Engineer",
    template: "%s | Anderson Magalhaes",
  },
  description:
    "Software Engineer with 15+ years of experience. Portfolio, projects, and developer tools.",
  metadataBase: new URL("https://andersonmagalhaes.dev"),
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Anderson Magalhaes - Software Engineer",
    description:
      "Software Engineer with 15+ years of experience. Portfolio, projects, and developer tools.",
    url: "https://andersonmagalhaes.dev",
    siteName: "Anderson Magalhaes",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
