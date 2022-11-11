import express from 'express';
const router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index', {
        eventname: process.env.EVENT_NAME
    });
});

export default router;