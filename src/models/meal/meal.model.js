import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    start_time: {
      type: Date,
      required: true
    },
    end_time: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);


const Meal = mongoose.model("Meal", mealSchema);
export default Meal;
