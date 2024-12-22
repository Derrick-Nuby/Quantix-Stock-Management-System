import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://quantix-stock.com/';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Quantix - Intelligent Stock Management System",
      template: "%s | Quantix"
    },
    description: "Transform your inventory management with Quantix. A comprehensive stock management solution offering real-time tracking, sales analytics, and intelligent stock predictions for modern businesses.",
    keywords: ["inventory management", "stock control", "business software", "sales tracking", "purchase management", "stock analytics", "warehouse management", "Quantix", "business intelligence"],
    authors: [{ name: "Quantix Development Team" }],
    creator: "Quantix Systems",
    publisher: "Quantix Technology Solutions",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName: "Quantix Stock Management",
      title: "Quantix - Intelligent Stock Management System",
      description: "Transform your inventory management with Quantix. A comprehensive stock management solution offering real-time tracking, sales analytics, and intelligent stock predictions for modern businesses.",
      images: [
        {
          url: `${siteUrl}/favicons/quantix-og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "Quantix - Intelligent Stock Management System",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Quantix - Intelligent Stock Management System",
      description: "Transform your inventory management with Quantix. A comprehensive stock management solution offering real-time tracking, sales analytics, and intelligent stock predictions for modern businesses.",
      images: [`${siteUrl}/favicons/quantix-og-image.jpg`],
      creator: "@QuantixSystems",
      site: "@QuantixStock",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicons/favicon.svg", type: "image/svg+xml" },
        { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [
        { url: "/favicons/apple-touch-icon.png", sizes: "180x180" },
      ],
      other: [
        { rel: "mask-icon", url: "/favicons/safari-pinned-tab.svg", color: "#2563eb" },
      ],
    },
    manifest: `${siteUrl}/favicons/manifest.json`,
    alternates: {
      canonical: siteUrl,
      languages: {
        'en-US': `${siteUrl}/en-US`,
      },
    },
    category: "Business Software",
    classification: "Inventory Management, Business Software",
  };
}