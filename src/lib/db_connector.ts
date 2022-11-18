import { Pool } from 'pg';
import envManager from './env_manager';
envManager.loadEnvs();

export default new Pool({
    max: 20,
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    port: parseInt(process.env.PG_PORT),
    idleTimeoutMillis: 30000
});