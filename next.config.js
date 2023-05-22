const path = require('path');
const { readFileSync } = require('fs');


const configFileLocation = path.join(process.env.CONFIG_FILE_DIR || "./envcfg", "competition.json");
const logoUrl = JSON.parse(readFileSync(configFileLocation, "utf8"))?.logoUrl;

console.log(logoUrl.split("://")[1].split("/")[0]);

if (typeof logoUrl !== "string" || !logoUrl) {
    throw new Error("competition.json is not valid");
}

/** @type {import('next').NextConfig} */
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
        domains: [ logoUrl.split("://")[1].split("/")[0] ],
        // domains: [ "storage.googleapis.com" ],
    },
}

module.exports = nextConfig
