import express from "express";
import PrescriptionController from "../controllers/prescription_controller.js";

const router = express.Router();

router.post("/upload", PrescriptionController.uploadPrescription);

router.get("/user/:userId", PrescriptionController.getPrescriptions);

router.get("/:id", PrescriptionController.downloadPrescription);

export default router;
