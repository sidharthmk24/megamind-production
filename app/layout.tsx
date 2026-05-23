import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google";
import LenisProvider from "@/components/providers/lenis-provider";
import IntroLoader from "@/components/IntroLoader";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Megamind Productions",
  description:
    "Animated cinematic production homepage for Megamind Productions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${syne.variable} antialiased`}
    >
      <body className="selection:bg-[var(--accent)] selection:text-[var(--background)] overflow-x-hidden">
        <LenisProvider>
          <IntroLoader />
          {children}
        </LenisProvider>
      </body>

    </html>
  );
}

