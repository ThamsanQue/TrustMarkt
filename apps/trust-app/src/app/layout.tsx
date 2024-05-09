import { auth } from "@/auth";
import { Header } from "@/components/navigation/main-nav";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "TrustMarkt",
  description:
    "TrustMarkt is an open-source project focused on enhancing the security and reliability of online commerce by verifying sellers' identities through advanced facial recognition technology.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body className={`font-sans ${inter.variable}`}>
          <Header />
          {children}
        </body>
        <Toaster />
      </SessionProvider>
    </html>
  );
}
