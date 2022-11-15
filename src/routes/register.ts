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
    let userExists = await queries.checkIfExistingNameorEmail(req.body.email, req.body.username);
    if (!userExists) {
        log.debug(`Attemping to register user ${req.body.username} ${req.body.email}`);
        let hashedPassword = await bcrypt.hash(req.body.password, 10);
        let uuid = crypto.randomUUID();
        await queries.addUser(uuid, req.body.email, req.body.username, hashedPassword, req.body.eligible);
        log.info(`Registered user ${req.body.email} ${req.body.username} ${hashedPassword}`);
        res.redirect('/login');
    } else {
        log.info(`Attempted registration of existing username/email: ${req.body.username} ${req.body.email}`);
        res.render('register', {
            error: "Username or email already in use, <a href='/login'>Log in instead?</a>"
        });
    }
});


export default router;