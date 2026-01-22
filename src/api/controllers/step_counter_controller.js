import StepCounter from "../../models/step_counter/step_counter_model.js";
import ApiResponse from "../../utils/api_response.js";
import mongoose from "mongoose";

class StepCounterController {
  static async upsertStepData(req, res) {
    console.log(req.body);
    const { userId, steps, calories, distance, duration, date } = req.body;

    try {
      if (!userId || !date) {
        return res
          .status(400)
          .json(ApiResponse.error("userId and date are required"));
      }

      const targetSteps = req.body.targetSteps || 10000;

      // Format date to start of day for consistency
      const queryDate = new Date(date);
      queryDate.setHours(0, 0, 0, 0);

      const stepData = await StepCounter.findOneAndUpdate(
        { userId, date: queryDate },
        {
          userId,
          steps,
          calories,
          distance,
          duration,
          targetSteps,
          date: queryDate.toISOString(),
          lastUpdated: new Date().toISOString(),
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
        }
      );

      return res
        .status(200)
        .json(ApiResponse.success("Step data saved successfully", stepData));
    } catch (error) {
      console.error("Error saving step data:", error);
      return res
        .status(500)
        .json(ApiResponse.error("Failed to save step data"));
    }
  }

  static async getStepData(req, res) {
    const { userId } = req.params;
    const { date } = req.query;

    try {
      if (!userId) {
        return res.status(400).json(ApiResponse.error("User ID is required"));
      }

      const query = { userId };

      if (date) {
        const queryDate = new Date(date);
        const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));
        query.date = { $gte: startOfDay, $lte: endOfDay };
      }

      const data = await StepCounter.find(query).sort({ date: -1 });

      if (data.length === 0) {
        return res.status(404).json(ApiResponse.error("No step data found"));
      }

      return res
        .status(200)
        .json(ApiResponse.success("Step data retrieved", data));
    } catch (error) {
      console.error("Error fetching step data:", error);
      return res
        .status(500)
        .json(ApiResponse.error("Failed to retrieve step data"));
    }
  }

  static async getStepSummary(req, res) {
    const { userId } = req.params;
    const { period = "week" } = req.query;

    try {
      if (!userId) {
        return res.status(400).json(ApiResponse.error("User ID is required"));
      }

      let startDate = new Date();
      const endDate = new Date();

      switch (period) {
        case "week":
          startDate.setDate(endDate.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case "year":
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        default:
          startDate = new Date(0);
      }

      const summary = await StepCounter.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: null,
            totalSteps: { $sum: "$steps" },
            avgSteps: { $avg: "$steps" },
            maxSteps: { $max: "$steps" },
            totalCalories: { $sum: "$calories" },
            totalDistance: { $sum: "$distance" },
            totalDuration: { $sum: "$duration" },
            daysRecorded: { $sum: 1 },
            daysAchievedGoal: {
              $sum: {
                $cond: [{ $gte: ["$steps", "$targetSteps"] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            totalSteps: 1,
            avgSteps: { $round: ["$avgSteps", 1] },
            maxSteps: 1,
            totalCalories: { $round: ["$totalCalories", 1] },
            totalDistance: { $round: ["$totalDistance", 2] },
            totalDuration: 1,
            daysRecorded: 1,
            goalAchievementRate: {
              $cond: [
                { $eq: ["$daysRecorded", 0] },
                0,
                {
                  $round: [
                    {
                      $multiply: [
                        { $divide: ["$daysAchievedGoal", "$daysRecorded"] },
                        100,
                      ],
                    },
                    1,
                  ],
                },
              ],
            },
          },
        },
      ]);

      return res
        .status(200)
        .json(ApiResponse.success("Step summary retrieved", summary[0] || {}));
    } catch (error) {
      console.error("Error fetching step summary:", error);
      return res
        .status(500)
        .json(ApiResponse.error("Failed to get step summary"));
    }
  }

  static async deleteStepData(req, res) {
    const { id } = req.params;

    try {
      const deletedData = await StepCounter.findByIdAndDelete(id);

      if (!deletedData) {
        return res.status(404).json(ApiResponse.error("Step data not found"));
      }

      return res
        .status(200)
        .json(
          ApiResponse.success("Step data deleted successfully", deletedData)
        );
    } catch (error) {
      console.error("Error deleting step data:", error);
      return res
        .status(500)
        .json(ApiResponse.error("Failed to delete step data"));
    }
  }
}

export default StepCounterController;
