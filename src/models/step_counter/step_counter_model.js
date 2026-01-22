import mongoose from "mongoose";

const stepCounterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    steps: {
      type: Number,
      required: true,
      min: 0,
    },
    calories: {
      type: Number,
      required: true,
      min: 0,
    },
    distance: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: Number,
      required: true,
      min: 0,
    },
    targetSteps: {
      type: Number,
      default: 10000,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index for faster queries
stepCounterSchema.index({ userId: 1, date: 1 }, { unique: true });

const StepCounter = mongoose.model("StepCounter", stepCounterSchema);

export default StepCounter;
