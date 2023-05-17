import { Redis } from "ioredis";

const redisPort = parseInt(process.env.REDIS_PORT ?? "6379") || 6379;
const cache = new Redis(redisPort, { keyPrefix: process.env.REDIS_PREFIX || "arcs-devel:" });

export default cache;
