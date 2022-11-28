import dotenv from 'dotenv';
import log from './logger';

const envDefaults = {
    "EVENT_NAME": "BCACTF",
    "SESSION_SECRET": "secret"
}

function loadEnvs() {
    dotenv.config();

    for (const key in envDefaults) {
        if (process.env[key] === undefined) {
            log.info(`Environment variable ${key} not set, using default value ${envDefaults[key]}`);
            process.env[key] = envDefaults[key];
        }
    }
}

export default { loadEnvs };