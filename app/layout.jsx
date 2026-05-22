export const metadata = {
  title: "ApplyReady — Federal Resume Optimizer | AI-Powered for USAJobs",
  description:
    "Upload your resume, paste a USAJobs or state job posting, and get an AI-optimized federal resume — formatted, KSA-aligned, and ready to upload. Free for job seekers.",
  keywords:
    "federal resume optimizer, USAJobs resume, government job resume, KSA resume, federal job application, AI resume, state jobs Hawaii, GS series resume, no-cost resume tool",
  openGraph: {
    title: "ApplyReady — Your Resume, Ready for Government",
    description:
      "AI-powered federal resume optimizer. Paste a USAJobs posting, upload your resume, download a PDF. Free.",
    url: "https://applyready.work",
    siteName: "ApplyReady",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApplyReady — Federal Resume Optimizer",
    description:
      "Free AI resume optimizer built for USAJobs and state government applications.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
