import express from 'express';
const router = express.Router();

router.get('/forgot-password', function (req, res) {
    res.render('password-reset-new', {
        eventname: process.env.EVENT_NAME
    });
});

router.post('/forgot-password', function (req, res) {
    // TODO
});

router.post('/reset-password', function (req, res) {
    // TODO
});

export default router;