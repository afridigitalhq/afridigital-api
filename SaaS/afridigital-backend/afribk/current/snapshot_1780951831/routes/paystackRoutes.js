import express from 'express';
import { initialize, verify } from '../controllers/paystackController.js';
const router = express.Router();
router.post('/initialize', initialize);
router.get('/verify/:reference', verify);
export default router;
