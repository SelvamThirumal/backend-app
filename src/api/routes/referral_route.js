import express from "express";
import ReferralController from "../../api/controllers/referral_controller.js";
const router = express.Router();

router.post("/", ReferralController.addReferral);
router.post("/check", ReferralController.checkAlreadyReferred);

export default router;
