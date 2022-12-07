import { compare } from 'bcrypt';
import log from './logger';
import queries from './queries';

async function joinTeam(req: any, res: any) {
    let user = req.session.user;
    let team = req.body.team;
    let password = req.body.password;
    let dbTeam = await queries.checkIfExistingTeam(team);
    if (dbTeam.rows.length === 0) {
        log.info(`Attempted to join non-existent team ${team}`);
        return res.render('update-team', {
            eventname: process.env.EVENT_NAME,
            user: req.session.user,
            error: "Team does not exist."
        });
    }
    let hashedPassword = dbTeam.rows[0].hashed_password;
    let match = await compare(password, hashedPassword);
    if (match) {
        log.info(`User ${user} joined team ${team}`);
        await queries.joinTeam(user, team);
    }
    else {
        log.info(`User ${user} provided incorrect password for team ${team}`);
        return res.render('update-team', {
            eventname: process.env.EVENT_NAME,
            user: req.session.user,
            error: "Incorrect password. Try again."
        });
    }
}

async function createTeam(req: any, res: any) {

}

export { joinTeam, createTeam };
// export default async function updateTeam(req: any, res: any) {
//     let user = req.body.user;
//     let password = req.body.password;
//     let dbUser: any = await queries.checkIfExistingUser(user);
//     if (dbUser.rows.length === 0) {
//         log.info(`Attempted login with non-existent user ${user}`);
//         return res.render('login', {
//             eventname: process.env.EVENT_NAME,
//             error: "User does not exist. Try <a href='/register'>registering instead</a>."
//         });
//     }
//     let hashedPassword = dbUser.rows[0].hashed_password;
//     let match = await compare(password, hashedPassword);
//     if (match) {
//         log.info(`User ${user} logged in`);
//         req.session.user = user;
//     }
//     else {
//         log.info(`User ${user} provided incorrect password`);
//         return res.render('login', {
//             eventname: process.env.EVENT_NAME,
//             error: "Incorrect password. Try again."
//         });
//     }
//     return res.redirect('/');
// }