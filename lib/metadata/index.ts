import { access } from "fs/promises";
import { constants } from "node:fs";


export class MetadataError extends Error {
    constructor(section: string) {
        super(`There was an issue with the \`${section}\` metadata.`);
    }
}


const DEFAULT_CONFIG_DIR = "./envcfg/";

const confirmConfigFileDirValid = async (dir: string): Promise<boolean> => {
    try {
        await access(dir, constants.R_OK);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};

let DIR: string | undefined = undefined;

const setConfigFileDir = async (): Promise<string> => {
    if (DIR) return DIR;

    let outputDir: string;
    const fromEnv = process.env.CONFIG_FILE_DIR;

    if (fromEnv) {
        if (await confirmConfigFileDirValid(fromEnv)) outputDir = fromEnv;
        else {
            console.error(`Bad config file directory: \`${fromEnv}\` is not a valid readable directory.`);
            process.exit(1);
        }
    } else {
        console.warn("No config directory specified.");
        if (await confirmConfigFileDirValid(DEFAULT_CONFIG_DIR)) outputDir = DEFAULT_CONFIG_DIR;
        else {
            console.error(`Default directory \`${DEFAULT_CONFIG_DIR}\` is not a valid readable directory.`);
            process.exit(1);
        }
        console.warn(`Using default config directory: \`${DEFAULT_CONFIG_DIR}\``);
    }

    DIR = outputDir;
    return outputDir;
};


const getConfigFileDir = async (): Promise<string> => {
    return await setConfigFileDir();
};
export default getConfigFileDir;

