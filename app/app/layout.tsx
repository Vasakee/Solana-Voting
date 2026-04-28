import type { Metadata } from "next";
import "./globals.css";
import { WalletContextProvider } from "@/components/WalletProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Voting DApp",
  description: "Solana voting application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletContextProvider>{children}</WalletContextProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
