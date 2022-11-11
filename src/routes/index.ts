import express from 'express';
import home from './home';
import rules from './rules';
import faq from './faq';
import register from './register';
import login from './login';
import resetPassword from './resetPassword';
import notFound from './404';

const router = express.Router();

router.use(home);
router.use(rules);
router.use(faq);
router.use(register);
router.use(login);
router.use(resetPassword);
router.use(notFound);


export default router;