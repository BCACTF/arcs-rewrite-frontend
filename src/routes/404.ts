import express from 'express';
import log from '../lib/logger';

const router = express.Router();

router.get('*', function (req, res) {
    log.warn(`404 on URL ${req.originalUrl}`);
    res.status(404).render('404', {
        eventname: process.env.EVENT_NAME
    });
});

export default router;