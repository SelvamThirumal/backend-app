import ApiResponse from "../../utils/api_response.js";
import mongoose from "mongoose";
import { User } from "../../models/auth/user.model.js";
import Referral from "../../models/referral_model.js";

class referralController {
  static async addReferral(req, res) {
    try {
      const { user_id, referralCode } = req.body;
      if (mongoose.Types.ObjectId.isValid(user_id) === false) {
        return res.status(400).json({ error: "Invalid user id" });
      }
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(400).json(ApiResponse.error("User not found"));
      }
      const referrer = await User.findOne({ referralCode: referralCode });
      if (!referrer) {
        return res.status(400).json(ApiResponse.error("Referrer not found"));
      }
      if (referrer._id.toString() === user_id) {
        return res
          .status(400)
          .json(ApiResponse.error("You cannot refer yourself"));
      }
      const referral = new Referral({
        user_id: user_id,
        referred_by: referrer._id,
      });
      await referral.save();
      user.referredBy = referralCode;
      await user.save();
      return res
        .status(200)
        .json(ApiResponse.success("Referral added successfully", true));
    } catch (error) {
      return res
        .status(500)
        .json(ApiResponse.error(error.message || "Internal server error"));
    }
  }

  static async checkAlreadyReferred(req, res) {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json(ApiResponse.error("User ID is required"));
      }

      if (!mongoose.Types.ObjectId.isValid(user_id)) {
        return res.status(400).json(ApiResponse.error("Invalid user id"));
      }

      const objectId = new mongoose.Types.ObjectId(user_id);

      const referral = await Referral.findOne({
        $or: [{ user_id: objectId }, { _id: objectId }],
      });

      if (!referral) {
        return res
          .status(404)
          .json(ApiResponse.error("User not found in referral list"));
      }

      return res.status(200).json(
        ApiResponse.success("User already referred", {
          referralId: referral._id,
          user_id: referral.user_id,
          referred_by: referral.referred_by,
        })
      );
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json(ApiResponse.error(error.message || "Internal server error"));
    }
  }
}

export default referralController;
