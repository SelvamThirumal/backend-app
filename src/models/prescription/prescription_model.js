import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  fileUrl: { type: String, required: true },
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);

export default Prescription;
