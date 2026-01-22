import mongoose from "mongoose";

const referralSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  referred_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const referralModel = new mongoose.model("referral", referralSchema);

export default referralModel;
