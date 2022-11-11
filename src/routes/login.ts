import express from 'express';
const router = express.Router();

router.get('/login', function (req, res) {
    res.render('login', {
        eventname: process.env.EVENT_NAME
    });
});

router.post('/login', function (req, res) {
    // TODO
});

export default router;