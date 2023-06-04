import { readFile } from "fs/promises";
import getConfigFileDir, { MetadataError } from "metadata";
import { join } from "path";

export interface Competition {
    name: string;
    start: number;
    end: number;
    logoUrl: string;
}

const validateJSON = (rawJson: unknown): rawJson is Competition => {
    if (typeof rawJson !== "object" || rawJson === null) return false;
    if (Array.isArray(rawJson) || typeof rawJson === "function") return false;

    const json = rawJson as Record<string, unknown>;

    const { name, start, end, logoUrl } = json;

    if (typeof name !== "string") return false;
    if (typeof start !== "number") return false;
    if (typeof end !== "number") return false;
    if (typeof logoUrl !== "string") return false;

    return true;
};

const getCompetitionNonCached = async (): Promise<Competition> => {
    const dir = await getConfigFileDir();
    const filePath = join(dir, "competition.json");
    const fileContents = await readFile(filePath, "utf8");
    const json: unknown = JSON.parse(fileContents);

    if (!validateJSON(json)) throw new MetadataError("competition");
    else return json;
};

let cachedCompetition: Competition | null = null;

const getCompetition = async (): Promise<Competition> => {
    if (cachedCompetition) return cachedCompetition;

    const config = await getCompetitionNonCached();
    cachedCompetition = config;

    return cachedCompetition;
};

export default getCompetition;
