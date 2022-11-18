import { hash } from 'bcrypt';
import crypto from 'crypto';
import log from './logger';
import queries from './queries';

export default async function registerUser(req: any, res: any) {
    if (req.body.password != req.body.password2) {
        return res.render('register', {
            eventname: process.env.EVENT_NAME,
            error: "Passwords do not match"
        });
    }
    let passwordMeetsRequirements = true;
    if (req.body.password.length < 8) {
        passwordMeetsRequirements = false;
    }
    if (!req.body.password.match(/[a-z]/)) {
        passwordMeetsRequirements = false;
    }
    if (!req.body.password.match(/[A-Z]/)) {
        passwordMeetsRequirements = false;
    }
    if (!req.body.password.match(/[0-9]/)) {
        passwordMeetsRequirements = false;
    }
    if (!req.body.password.match(/[^a-zA-Z0-9]/)) {
        passwordMeetsRequirements = false;
    }
    if (!passwordMeetsRequirements) {
        return res.render('register', {
            eventname: process.env.EVENT_NAME,
            error: "Password does not meet requirements"
        });
    }

    let userExists = await queries.checkIfExistingUser(req.body.email, req.body.username);
    if (!userExists) {
        log.debug(`Attemping to register user ${req.body.username} ${req.body.email}`);
        let hashedPassword = await hash(req.body.password, 10);
        let uuid = crypto.randomUUID();
        await queries.addUser(uuid, req.body.email, req.body.username, hashedPassword, req.body.eligible);
        log.info(`Registered user ${req.body.email} ${req.body.username} ${hashedPassword}`);
        return res.redirect('/login');
    } else {
        log.info(`Attempted registration of existing username/email: ${req.body.username} ${req.body.email}`);
        return res.render('register', {
            eventname: process.env.EVENT_NAME,
            error: "Username or email already in use, <a href='/login'>Log in instead?</a>"
        });
    }
}