import { Router } from 'express';

const router = Router();

router.get('/users', (req, res) => {
    res.send("User route test");
});

export default router;