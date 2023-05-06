/** @type {import('next').NextConfig} */
const path = require('path');

let event_url_domain = process.env.NEXT_PUBLIC_EVENT_LOGO_URL;

if (!event_url_domain) {
    throw new Error("NEXT_PUBLIC_EVENT_LOGO_URL not defined");
}

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    sassOptions: {
        includePaths: [
            path.join(__dirname, 'styles'),
            path.join(__dirname, 'lib/**'),
        ],
    },
    images: {
        // assumes http or https preprended, and trailing 
        domains: [ event_url_domain.split("://")[1].split("/")[0] ],
        // domains: [ "storage.googleapis.com" ],
    },
}

module.exports = nextConfig
