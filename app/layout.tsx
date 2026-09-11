import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ApplyReady — Are You Ready to Move Forward?",
  description:
    "ApplyReady helps you figure out what you have, what you're missing, and what should happen next. A 2-minute readiness diagnostic.",
  openGraph: {
    title: "ApplyReady",
    description:
      "Are you ready to move forward? A 2-minute readiness diagnostic that tells you what to do next.",
    url: "https://applyready.work",
    siteName: "ApplyReady",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cormorant.variable}>
      <body className="font-sans bg-paper text-ink min-h-screen flex flex-col">
        <div className="flex-1">{children}</div>
        <footer className="border-t border-line px-5 py-6">
          <p className="max-w-3xl mx-auto text-[11px] leading-relaxed text-muted">
            <strong className="text-ink">Important Disclaimer:</strong> ApplyReady is not
            affiliated with USAJOBS, OPM, or any government agency. We provide AI-assisted tools
            to help individuals prepare job application materials. Users are responsible for
            reviewing all application materials before submission. ApplyReady does not guarantee
            job interviews, employment offers, or federal selection outcomes.
          </p>
        </footer>
      </body>
    </html>
  );
}
