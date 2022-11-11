import dotenv from 'dotenv';

const envDefaults = {
    "EVENT_NAME": "BCACTF",
}

function loadEnvs() {
    dotenv.config();

    for (const key in envDefaults) {
        if (process.env[key] === undefined) {
            process.env[key] = envDefaults[key];
        }
    }
}

export default { loadEnvs };