import { Redis } from "ioredis";
import { getConfig } from "metadata/server";

let openCache: Redis | undefined;

const getOrInitCache = async (): Promise<Redis> => {
    if (openCache) return openCache;

    const redisPort = parseInt(process.env.REDIS_PORT ?? "6379") || 6379;
    const cache = new Redis(redisPort, { keyPrefix: (await getConfig()).redisKeyPrefix });

    openCache = cache;
    return cache;
};

const cache = async () => await getOrInitCache();


export default cache;
