import express from 'express';
const router = express.Router();

router.get('/rules', function (req, res) {
    res.render('rules', {
        eventname: process.env.EVENT_NAME
    });
});

export default router;