import express from "express";
import { getLandingFeatureFlags } from "./featureFlags.controller.js";

const router = express.Router();

router.get("/landing", getLandingFeatureFlags);

export default router;
