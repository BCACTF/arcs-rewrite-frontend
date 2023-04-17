import { Redis } from "ioredis";

const redisPort = parseInt(process.env.REDIS_PORT ?? "6379") || 6379;
const cache = new Redis(redisPort);

export default cache;
