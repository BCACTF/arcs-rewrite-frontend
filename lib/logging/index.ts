import { createWriteStream, constants } from "fs";
import { join } from "path";

import { makeLoggingSuite, idLogWrap } from "arcs-logging-node";
import { GetServerSideProps, NextApiHandler } from "next";
import { mkdir } from "fs/promises";

let apiLogger: ReturnType<typeof makeLoggingSuite>;
let pageLogger: ReturnType<typeof makeLoggingSuite>;

interface LoggingProcess extends NodeJS.Process {
    loggingFiles?: { api: ReturnType<typeof makeLoggingSuite>, page: ReturnType<typeof makeLoggingSuite> };
}

const setup = () => {
    if (typeof process !== "undefined" && process !== null) {
        const loggingProcess = process as LoggingProcess;
        if (loggingProcess.loggingFiles) {
            apiLogger = loggingProcess.loggingFiles.api;
            pageLogger = loggingProcess.loggingFiles.page;
            return;
        }

        mkdir("./logs").catch(() => console.log("Logs directory already exists."));


        const apiLogFilePath = join(process.cwd(), "./logs/api.log");
        const apiLogFile = createWriteStream(apiLogFilePath, {
            encoding: "utf8",
            mode: constants.O_APPEND | constants.O_CREAT | constants.O_RDWR
                | constants.S_IRUSR | constants.S_IWUSR | constants.S_IRGRP | constants.S_IRGRP,
            flags: "a+",
        });
        
        apiLogger = makeLoggingSuite("API", process.cwd(), line => apiLogFile.write(line));
        
        const pageLogFilePath = join(process.cwd(), "./logs/page.log");
        const pageLogFile = createWriteStream(pageLogFilePath, {
            encoding: "utf8",
            mode: constants.O_APPEND | constants.O_CREAT | constants.O_RDWR
                | constants.S_IRUSR | constants.S_IWUSR | constants.S_IRGRP | constants.S_IRGRP,
            flags: "a+",
        });
        
        pageLogger = makeLoggingSuite("Page", process.cwd(), line => pageLogFile.write(line));
    } else throw new Error("This file can only be run on a node.js runtime.");
};
setup();


const wrapServerSideProps = <Props extends Record<string, any>>(
    fn: GetServerSideProps<Props>
) => idLogWrap(fn);

const wrapApiEndpoint = (
    fn: NextApiHandler,
) => idLogWrap(fn);

export { apiLogger, pageLogger, wrapServerSideProps, wrapApiEndpoint };


