import { createWriteStream } from "fs";
import { join } from "path";

import { makeLoggingSuite, idLogWrap } from "arcs-logging-node";
import { GetServerSideProps } from "next";
import { mkdir } from "fs/promises";

mkdir("./logs")

const apiLogFilePath = join(process.cwd(), "./logs/api.log");
const apiLogFile = createWriteStream(apiLogFilePath, { encoding: "utf8", start: Number.MAX_SAFE_INTEGER });

export const apiLogger = makeLoggingSuite("API", process.cwd(), line => apiLogFile.write(line));

const pageLogFilePath = join(process.cwd(), "./logs/page.log");
const pageLogFile = createWriteStream(pageLogFilePath, "utf8");

export const pageLogger = makeLoggingSuite("Page", process.cwd(), line => pageLogFile.write(`${line}\n`));

export const wrapServerSideProps = <Props extends Record<string, any>>(
    fn: GetServerSideProps<Props>
) => idLogWrap(fn);

