import express from 'express';
import bcrypt from 'bcrypt';
import queries from '../queries';
import log from '../logger';
import crypto from 'crypto';

const router = express.Router();

router.get('/register', function (req, res) {
    res.render('register', {
        eventname: process.env.EVENT_NAME
    });
});

router.post('/register', async function (req, res) {
    const users = await queries.getUsers();
    const userExists = users.rows.find(user => user.username === req.body.username);
    const emailExists = users.rows.find(user => user.email === req.body.email);
    if (!(userExists || emailExists)) {
        log.debug(`Attemping to register user ${req.body.username} ${req.body.email}`);
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        let uuid = crypto.randomUUID();
        await queries.addUser(uuid, req.body.username, req.body.email, hashedPassword, req.body.eligible);
        log.info(`Registered user ${req.body.username} ${req.body.email} ${hashedPassword}`);
        res.redirect('/login');
    } else {
        log.info(`Attempted registration of existing user ${req.body.username} ${req.body.email}`);
        res.render('register', {
            error: "Username or email already in use, <a href='/login'>Log in instead?</a>"
        });
    }


});


export default router;