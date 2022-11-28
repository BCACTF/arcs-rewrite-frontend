import express from 'express';
const router = express.Router();

router.get('/', function (req, res) {
    res.render('home', {
        eventname: process.env.EVENT_NAME,
        user: req.session.user
    });
});

export default router;