import ApiResponse from "../../utils/api_response.js";
import { getTodayByDate } from "../../utils/date_time_utils.js";
import { User } from "../../models/auth/user.model.js";

function getUserProgress() {
  // Implement the logic to get the user's progress
  return 30;
}

class OverviewController {
  static async getOverview(req, res) {
    try {
      const { date } = req.query;

      let userReport = [];

      const targeted_date = date ? getTodayByDate(date) : getTodayByDate();

      // Get the user's progress
      const users = await User.find().select(
        "-password -__v -token -created_at -updated_at"
      );

      for (let user of users) {
        console.log(
          `Checking user: ${user.email}, status_id: ${user.status_id}`
        );
        if (user.status_id === 1) {
          const progress = getUserProgress(user._id, targeted_date);
          userReport.push({ ...user._doc, progress: progress });
        } else {
          console.log("User profile not exist");
        }
      }

      // Implement the logic to get the user's overview

      res
        .status(200)
        .json(
          ApiResponse.success("User report retrieved successfully", userReport)
        );
    } catch (error) {
      res
        .status(500)
        .json(ApiResponse.error(error.message || "Internal server error"));
    }
  }
}

export default OverviewController;
