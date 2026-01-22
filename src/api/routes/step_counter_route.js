import express from "express";
import StepCounterController from "../controllers/step_counter_controller.js";

const router = express.Router();

router.post("/", StepCounterController.upsertStepData);
router.get("/:userId", StepCounterController.getStepData);
router.get("/:userId/summary", StepCounterController.getStepSummary);

router.delete("/:id", StepCounterController.deleteStepData);

export default router;
