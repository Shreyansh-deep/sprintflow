import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "SprintFlow",
  description: "Lightweight issue & sprint tracker",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
