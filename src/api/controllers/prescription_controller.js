import Prescription from "../../models/prescription/prescription_model.js";
import ApiResponse from "../../utils/api_response.js";

class PrescriptionController {
  static async uploadPrescription(req, res) {
    try {
      const { userId, fileUrl } = req.body;

      if (!fileUrl || !userId) {
        return res
          .status(400)
          .send(ApiResponse.error("fileUrl and userId are required"));
      }

      const newPrescription = new Prescription({
        userId,
        fileUrl,
      });

      const saved = await newPrescription.save();
      return res
        .status(201)
        .send(ApiResponse.success(saved, "Prescription uploaded"));
    } catch (err) {
      return res
        .status(500)
        .send(ApiResponse.error("Upload failed: " + err.message));
    }
  }

  static async getPrescriptions(req, res) {
    try {
      const { userId } = req.params;
      const files = await Prescription.find({ userId }).select("-data");
      return res.status(200).send(ApiResponse.success(files));
    } catch (err) {
      return res
        .status(500)
        .send(ApiResponse.error("Upload failed: " + err.message));
    }
  }

  static async downloadPrescription(req, res) {
    try {
      const { id } = req.params;
      const file = await Prescription.findById(id);
      if (!file)
        return res.status(404).send(ApiResponse.error("File not found"));

      res.set("Content-Type", file.contentType);
      res.set("Content-Disposition", `inline; filename="${file.fileName}"`);
      return res.send(file.data);
    } catch (err) {
      return res.status(500).send(ApiResponse.error(err.message));
    }
  }
}

export default PrescriptionController;
