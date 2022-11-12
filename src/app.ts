import express from 'express';
import path from 'path';
import logger from 'morgan';
import hbs from 'hbs';
import envManager from './envManager';
import routes from './routes';
import log from './logger';

log.info("Application started");
log.debug("Loading environment variables");
envManager.loadEnvs();
log.info("Environment variables loaded");
// TODO: Test if able to connect oand query database
log.debug("Creating express application...");
const app = express();
const port = 3000;
app.use(logger('tiny'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

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
