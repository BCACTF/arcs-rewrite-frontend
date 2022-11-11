import express from 'express';
import home from './home';
import rules from './rules';

const router = express.Router();

router.use(home);
router.use(rules);

export default router;