import express from 'express';
import * as team from '../lib/team_update';
const router = express.Router();

router.get('/update_team', function (req, res) {
    res.render('update-team', {
        eventname: process.env.EVENT_NAME,
        user: req.session.user
    });
});

router.post('/join_team', team.joinTeam);

router.post('/create_team', team.createTeam);

export default router;