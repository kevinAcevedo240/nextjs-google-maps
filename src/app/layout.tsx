// Global styles
import "../styles/globals.css";
import "../styles/theme-animation.css";

// Types
import type { Metadata } from "next";

// Fonts
import { Poppins } from "next/font/google";

// Providers
import { ThemeProvider } from "@/providers/theme-provider";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "NextJs + Google Maps",
  description: "NextJs + Google Maps tutorial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased  `}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
