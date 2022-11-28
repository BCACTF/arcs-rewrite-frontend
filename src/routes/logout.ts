import express from 'express';
import log from '../lib/logger';
const router = express.Router();

router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            log.error(`Error destroying session: ${err}`);
        } else {
            res.redirect('/');
        }
    });
});

export default router;