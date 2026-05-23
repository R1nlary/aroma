import { Router } from 'express';

const router = Router();

router.post('/', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message required' });
  }
  res.json({ success: true, message: `Thanks ${name}, we received your message!` });
});

export default router;
