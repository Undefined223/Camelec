import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from 'next'
import ClientLayout from "./ClientLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "jsvectormap/dist/jsvectormap.css";
import 'flatpickr/dist/flatpickr.min.css';  
import "@/app/components/css/satoshi.css";
import "@/app/components/css/style.css";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Camelec Electrique',
  description: 'Infoplus offers the best selection of products with an intuitive shopping experience. Discover our collection today!',
  openGraph: {
    title: 'Camelec Electrique',
    description: 'Infoplus offers the best selection of products with an intuitive shopping experience. Discover our collection today!',
    url: 'https://infoplus-store.com',
    siteName: 'Camelec Electrique',
    images: [
      {
        url: 'https://i.ibb.co/6XjRhtY/camelec-removebg-preview.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InfoPlus Store',
    description: 'Infoplus offers the best selection of products with an intuitive shopping experience. Discover our collection today!',
    images: ['https://i.ibb.co/qdF2qkD/banner.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}