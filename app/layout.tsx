import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ApplyReady — Become Ready for the Opportunity in Front of You",
  description:
    "Show ApplyReady what you're trying to qualify for. We'll determine what it requires, what you already have, what's missing, and help you finish the rest.",
  openGraph: {
    title: "ApplyReady",
    description:
      "Turn an opportunity into a completion plan — requirements, evidence, gaps, and actions.",
    url: "https://applyready.work",
    siteName: "ApplyReady",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cormorant.variable}>
      <body className="font-sans bg-paper text-ink min-h-screen flex flex-col">
        <header className="border-b border-line/80">
          <div className="mx-auto max-w-5xl px-5 h-14 flex items-center justify-between">
            <Link href="/" className="font-serif text-xl text-ink tracking-wide">
              ApplyReady
            </Link>
            <nav className="flex items-center gap-5 text-sm text-muted">
              <Link href="/diagnostic" className="hover:text-ink transition-colors">
                Diagnostic
              </Link>
              <Link href="/pricing" className="hover:text-ink transition-colors">
                Pricing
              </Link>
              <Link
                href="/"
                className="rounded-card bg-navy text-white px-3.5 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity"
              >
                Bring opportunity
              </Link>
            </nav>
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="border-t border-line px-5 py-6">
          <p className="max-w-3xl mx-auto text-[11px] leading-relaxed text-muted">
            <strong className="text-ink">Important Disclaimer:</strong> ApplyReady is not
            affiliated with the U.S. federal government, USAJOBS, OPM, SBA, or any government
            agency. We provide tools to help individuals and businesses organize requirements,
            evidence, and application materials. Users are responsible for reviewing all materials
            before submission. ApplyReady does not guarantee interviews, awards, certifications,
            contract wins, or selection outcomes.
          </p>
        </footer>
      </body>
    </html>
  );
}
