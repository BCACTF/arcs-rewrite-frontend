import express from 'express';
import home from './home';
import rules from './rules';
import faq from './faq';

const router = express.Router();

router.use(home);
router.use(rules);
router.use(faq);

export default router;