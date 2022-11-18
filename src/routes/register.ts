import express from 'express';
import registerUser from '../lib/user_register';
const router = express.Router();

router.get('/register', function (req, res) {
    res.render('register', {
        eventname: process.env.EVENT_NAME
    });
});

router.post('/register', registerUser);

export default router;