import express from 'express';
import path from 'path';
import logger from 'morgan';
import routes from './routes';
import hbs from 'hbs';
import envManager from './envManager';

envManager.loadEnvs();
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.set("views", path.join(__dirname, "../", "views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "../", "views/partials"));

app.use(routes);
const port = 3000;

app.listen(port, () => {
    return console.log(`Server started at http://localhost:${port}`);
});
