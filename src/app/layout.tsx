import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AdSenseScript } from "@/components/AdSense";
import { AuthProvider } from "@/components/AuthProvider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { buildSearchIndex } from "@/lib/courses";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "CodeLibrary — Learn programming languages and frameworks",
    template: "%s · CodeLibrary",
  },
  description:
    "Free, in-depth tutorials for programming languages and frameworks. Start with the complete Python course: 70+ lessons from your first program to async, testing and packaging.",
  keywords: [
    "python tutorial",
    "learn python",
    "programming tutorials",
    "fastapi tutorial",
    "free coding course",
  ],
};

/**
 * Applies the saved theme before first paint so there is no flash of the wrong
 * palette. Dark is the default because most of the page is code.
 */
const themeScript = `(function(){try{var t=localStorage.getItem('code-library:theme');var d=t?t==='dark':true;document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchIndex = buildSearchIndex();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <AuthProvider>
          <SiteHeader index={searchIndex} />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </AuthProvider>
        <AdSenseScript />
      </body>
    </html>
  );
}
