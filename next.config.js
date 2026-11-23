/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // FIND modules run on the shared FormBuddy assessment engine; their
    // ApplyReady-branded address is a subdomain served by that project.
    return [
      { source: "/find/venturefit", destination: "https://venturefit.applyready.work", permanent: false },
    ];
  },
};
module.exports = nextConfig;
