export interface GlobalFileWebLocations {
    favicon: string;
}

export interface Environment {
    fileLocations: GlobalFileWebLocations;
}

export const getEnvironment = (): Environment => ({
    fileLocations: {
        favicon: process.env.FAVICON_PATH ?? "/favicon.ico",
    }
});
