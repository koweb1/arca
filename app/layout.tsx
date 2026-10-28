import type { Metadata, Viewport } from "next";
import "@fontsource-variable/archivo/standard.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import JsonLd from "@/components/ui/JsonLd";
import { siteConfig, siteJsonLd } from "@/lib/seo";
import "./globals.css";

const title = `${siteConfig.name} | Architecture & Interior Studio`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: { default: title, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  category: "architecture",
  alternates: { canonical: "/" },
  // og:image comes from app/opengraph-image.tsx. X falls back to it for twitter:image.
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: siteConfig.name,
    title,
    description: siteConfig.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteConfig.description,
  },
  formatDetection: { telephone: false, email: false, address: false },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b1114",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="overflow-x-clip bg-ink font-sans text-base leading-[1.55] text-fg antialiased">
        <JsonLd data={siteJsonLd} />
        {children}
      </body>
    </html>
  );
}