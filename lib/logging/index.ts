import { createWriteStream } from "fs";
import { join } from "path";

import { makeLoggingSuite, idLogWrap } from "arcs-logging-node";
import { GetServerSideProps, NextApiHandler } from "next";
import { mkdir } from "fs/promises";

const setup = () => {
    if (typeof process !== "undefined" && process !== null) {
        if (process.env.SETUP_DONE) return;
        process.env.SETUP_DONE = "true";
        mkdir("./logs").catch(() => console.log("Logs directory already exists."));
    }
};
setup();

const apiLogFilePath = join(process.cwd(), "./logs/api.log");
const apiLogFile = createWriteStream(apiLogFilePath, "utf8");

export const apiLogger = makeLoggingSuite("API", process.cwd(), line => apiLogFile.write(line));

const pageLogFilePath = join(process.cwd(), "./logs/page.log");
const pageLogFile = createWriteStream(pageLogFilePath, "utf8");

export const pageLogger = makeLoggingSuite("Page", process.cwd(), line => pageLogFile.write(line));

export const wrapServerSideProps = <Props extends Record<string, any>>(
    fn: GetServerSideProps<Props>
) => idLogWrap(fn);

export const wrapApiEndpoint = (
    fn: NextApiHandler,
) => idLogWrap(fn);

