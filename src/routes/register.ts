import express from 'express';
const router = express.Router();

router.get('/register', function (req, res) {
    res.render('register', {
        eventname: process.env.EVENT_NAME
    });
});

router.post('/register', function (req, res) {
    // TODO
});

export default router;