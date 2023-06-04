import { readFile } from "fs/promises";
import getConfigFileDir, { MetadataError } from "metadata";
import { join } from "path";



type Url = `https://${string}` | `http://${string}`;


/**
 * Validation and access for "Config" from config.json.
 */

export interface Config {
    port: number;
    frontendAuthToken: string;
    webhook: {
        authToken: string;
        url: Url;
        clientOauthAllowToken: string;
    };
    redisKeyPrefix: string;
}

const validateConfigJSON = (rawJson: unknown): rawJson is Config => {
    if (typeof rawJson !== "object" || rawJson === null) return false;
    if (Array.isArray(rawJson) || typeof rawJson === "function") return false;

    const json = rawJson as Record<string, unknown>;

    const { port, frontendAuthToken, webhook, redisKeyPrefix } = json;

    if (typeof port !== "number") return false;
    if (typeof frontendAuthToken !== "string") return false;
    if (typeof redisKeyPrefix !== "string") return false;

    if (typeof webhook !== "object" || webhook === null) return false;
    if (Array.isArray(webhook) || typeof webhook === "function") return false;


    const { authToken, url, clientOauthAllowToken } = webhook as Record<string, unknown>;

    if (typeof authToken !== "string") return false;
    if (typeof url !== "string") return false;
    if (typeof clientOauthAllowToken !== "string") return false;


    if (frontendAuthToken.length < 20 || authToken.length < 20)     return false; // Auth token must be at least 20 characters.
    if (clientOauthAllowToken.length < 20)                          return false; // Oauth allow token must be at least 20 characters.
    if (!url.startsWith("http://") && !url.startsWith("https://"))  return false; // Webhook URL must be http(s).
    if (!Number.isInteger(port) || port < 1 || port > 65535)        return false; // Port must be between an integer 1 and 65535.
    if (redisKeyPrefix.split("").some(char => char.match(/\s/)))    return false; // Redis key prefix must have no whitespace in it.

    return true;
};

const getConfigNonCached = async (): Promise<Config> => {
    const dir = await getConfigFileDir();
    const filePath = join(dir, "config.json");
    const fileContents = await readFile(filePath, "utf8");
    const json: unknown = JSON.parse(fileContents);

    if (!validateConfigJSON(json)) throw new MetadataError("config");
    else return json;
};

let cachedConfig: Config | null = null;

const getConfig = async (): Promise<Config> => {
    if (cachedConfig) return cachedConfig;

    const config = await getConfigNonCached();
    cachedConfig = config;

    return config;
};



/**
 * Validation and access for "Config" from config.json.
 */

export interface Oauth {
    providers: Record<string, {
        id: string;
        secret: string;
    }>;
    nextAuth: {
        secret: string;
        url: Url;
    };
}

const providerNameValid = (name: string): boolean => name.split("").every(ch => "abcdefghijklmnopqrstuvwxyz0123456789-".includes(ch));

const validateOauthJSON = (rawJson: unknown): rawJson is Oauth => {
    if (typeof rawJson !== "object" || rawJson === null) return false;
    if (Array.isArray(rawJson) || typeof rawJson === "function") return false;

    const json = rawJson as Record<string, unknown>;

    const { providers, nextAuth } = json;


    {
        if (typeof nextAuth !== "object" || nextAuth === null) return false;
        if (Array.isArray(nextAuth) || typeof nextAuth === "function") return false;
    
        const { secret, url } = nextAuth as Record<string, unknown>;
    

        if (typeof secret !== "string") return false;
        if (typeof url !== "string") return false;

        if (!url.startsWith("http://") && !url.startsWith("https://")) return false; // NextAuth URL must be http(s).
    }


    {
        if (typeof providers !== "object" || providers === null) return false;
        if (Array.isArray(providers) || typeof providers === "function") return false;
    
        const providerEntriesUndef = Object.entries(providers).map(
            ([key, value]) => providerNameValid(key)
                ? [key, value as unknown] as const
                : undefined
        );
        
        if (providerEntriesUndef.some(val => val === undefined)) return false;

        const providerEntries = providerEntriesUndef.flatMap(v => v === undefined ? [] : [v]);

        for (const [, providerInfo] of providerEntries) {
            if (typeof providerInfo !== "object" || providerInfo === null) return false;
            if (Array.isArray(providerInfo) || typeof providerInfo === "function") return false;
            
            const { id, secret } = providerInfo as Record<string, unknown>;

            if (typeof id !== "string") return false;
            if (typeof secret !== "string") return false;
        }
    }
    return true;
};

const getOauthNonCached = async (): Promise<Oauth> => {
    const dir = await getConfigFileDir();
    const filePath = join(dir, "oauth.json");
    const fileContents = await readFile(filePath, "utf8");
    const json: unknown = JSON.parse(fileContents);

    if (!validateOauthJSON(json)) throw new MetadataError("oauth");
    else return json;
};

let cachedOauth: Oauth | null = null;

const getOauth = async (): Promise<Oauth> => {
    if (cachedOauth) return cachedOauth;

    const oauth = await getOauthNonCached();
    cachedOauth = oauth;

    return oauth;
};

export { getConfig, getOauth };
