import express from 'express';
const router = express.Router();

router.get('/faq', function (req, res) {
    res.render('faq', {
        eventname: process.env.EVENT_NAME
    });
});

export default router;