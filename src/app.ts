import express from 'express';
import path from 'path';
import logger from 'morgan';
import hbs from 'hbs';
import envManager from './envManager';
import routes from './routes';

envManager.loadEnvs();
const app = express();
const port = 3000;
// TODO: add logging configuration
app.use(logger('dev'));

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

app.listen(port, () => {
    return console.log(`Server started at http://localhost:${port}`);
});
