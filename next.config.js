// Load environment variables
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

// Import PWA plugin
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require("next-pwa")({
    dest: "public", // Destination directory for the PWA files
    disable: process.env.NEXT_PUBLIC_NODE_ENV === "development", // Disable PWA in development mode
    register: true, // Register the PWA service worker
    skipWaiting: true, // Skip waiting for service worker activation
});

// Next.js configuration
const nextConfig = {

    images: {
        domains: ["unibuzz-uploads-prod.s3.amazonaws.com"],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**', // Accepts all domains
            },
            {
                protocol: 'http',
                hostname: '**', // Accepts all domains
            },
        ],
    },

    // Custom headers for API routes
    async headers() {
        return [
            {
                // Matching all API routes
                source: "/api/:path*",
                headers: [
                    {key: "Access-Control-Allow-Credentials", value: "true"},
                    {key: "Access-Control-Allow-Origin", value: process.env.NEXT_PUBLIC_NODE_ENV === "production" ? process.env.NEXT_PUBLIC_API_BASE_URL || "https://your-domain.com" : "*"},
                    {key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT"},
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
                    },
                ],
            },
            {
                // Security headers for all pages
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "origin-when-cross-origin",
                    },
                ],
            },
        ];
    },
};


module.exports = withPWA(nextConfig);
