import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@clerk/nextjs";
import { DynamicFavicon } from "@/components/layout/DynamicFavicon";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

import { getBrandingConfig } from "@/lib/actions/branding";

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getBrandingConfig();
  const systemName = branding.data?.systemName || "Audazz";
  const slogan = branding.data?.slogan || "Gestão de Alta Performance";
  const favicon = branding.data?.favicon || "/favicon.ico";

  return {
    title: `${systemName} | ${slogan}`,
    description: `Sistema de gestão proprietário da ${systemName.split(' ')[0]}.`,
    icons: {
      icon: favicon,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const branding = await getBrandingConfig();
  const favicon = branding.data?.favicon || "/favicon.ico";

  return (
    <html lang="pt-BR" suppressHydrationWarning className={poppins.variable}>
      <head>
        <link rel="icon" href={favicon} sizes="any" />
      </head>
      <body
        className="antialiased"
        suppressHydrationWarning
      >
        <ClerkProvider>
          <DynamicFavicon />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              {children}
              <Toaster position="top-right" />
            </TooltipProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
