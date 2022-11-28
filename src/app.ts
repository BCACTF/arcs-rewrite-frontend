import express from 'express';
import sessions from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';
import logger from 'morgan';
import hbs from 'hbs';
import envManager from './lib/env_manager';
import routes from './routes';
import log from './lib/logger';

log.info("Application started");
log.debug("Loading environment variables");
envManager.loadEnvs();
log.info("Environment variables loaded");
// TODO: Test if able to connect and query database
log.debug("Creating express application...");
const app = express();
const port = 3000;

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(sessions({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false
}));
declare module "express-session" {
    interface SessionData {
        user: string;
    }
}
app.use(cookieParser());
app.set("views", path.join(__dirname, "../", "views"));
app.set("view engine", "hbs");
hbs.registerHelper('concat', function () {
    var str = "";
    Array.from(arguments).forEach(e => {
        str += (typeof e === "string" ? e : "");
    });
    return str;
});
hbs.registerPartials(path.join(__dirname, "../", "views/partials"));

app.use(routes);
log.info("Express application created");

app.listen(port, () => {
    log.info(`Server started at http://localhost:${port}`);
});
