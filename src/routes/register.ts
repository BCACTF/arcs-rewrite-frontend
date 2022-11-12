import express from 'express';
import bcrypt from 'bcrypt';
import queries from '../queries';

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
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await queries.addUser(req.body.username, req.body.email, hashedPassword);
        res.redirect('/login');
    } else {
        res.render('register', {
            error: "Username or email already in use, <a href='/login'>Log in instead?</a>"
        });
    }


});


export default router;