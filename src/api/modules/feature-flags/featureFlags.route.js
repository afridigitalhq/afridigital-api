import express from 'express';
import { getFeatureFlags } from './featureFlags.controller.js';

const router = express.Router();

router.get('/', getFeatureFlags);

export default router;
