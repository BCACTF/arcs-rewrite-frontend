import express from 'express';
import home from './home';
import rules from './rules';
import faq from './faq';
import notFound from './404';

const router = express.Router();

router.use(home);
router.use(rules);
router.use(faq);
router.use(notFound);

export default router;