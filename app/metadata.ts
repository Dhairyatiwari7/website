import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "QuickCare",
  description: "Your trusted healthcare companion",
  keywords: ["healthcare", "medical", "doctor", "consultation", "health"],
  authors: [{ name: "HealthBuddy Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
  openGraph: {
    title: "HealthBuddy",
    description: "Your trusted healthcare companion",
    type: "website",
    siteName: "QuickCare",
  },
  robots: {
    index: true,
    follow: true,
  },
};