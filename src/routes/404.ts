import express from 'express';
const router = express.Router();

router.get('*', function (req, res) {
    res.status(404).render('404', {
        eventname: process.env.EVENT_NAME
    });
});

export default router;