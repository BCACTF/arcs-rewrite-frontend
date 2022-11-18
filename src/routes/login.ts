import express from 'express';
import loginUser from '../lib/user_login';
const router = express.Router();

router.get('/login', function (req, res) {
    res.render('login', {
        eventname: process.env.EVENT_NAME
    });
});

router.post('/login', loginUser);

export default router;