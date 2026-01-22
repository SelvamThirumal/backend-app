// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Import database connection and express app
import connect from "./db/mongoDB.js";
import app from "./app.js";

// Import the Meal model
import Meal from "./models/meal/meal.model.js";
import { getDate_24_HH_MM } from "./utils/date_time_utils.js";

// ✅ Local = 5000 (from .env)
// ✅ Render = dynamic PORT injected by Render
const PORT = process.env.PORT || 5000;

let server;

// Define default meals
const defaultMeals = [
  {
    name: "breakfast",
    start_time: getDate_24_HH_MM("07:00"),
    end_time: getDate_24_HH_MM("09:00"),
  },
  {
    name: "morning_snacks",
    start_time: getDate_24_HH_MM("09:30"),
    end_time: getDate_24_HH_MM("10:30"),
  },
  {
    name: "lunch",
    start_time: getDate_24_HH_MM("12:00"),
    end_time: getDate_24_HH_MM("14:00"),
  },
  {
    name: "evening_snacks",
    start_time: getDate_24_HH_MM("16:00"),
    end_time: getDate_24_HH_MM("17:00"),
  },
  {
    name: "dinner",
    start_time: getDate_24_HH_MM("19:00"),
    end_time: getDate_24_HH_MM("21:00"),
  },
];

// Graceful shutdown (prevents port lock issues)
const shutdown = () => {
  console.log("🛑 Shutting down server...");
  if (server) {
    server.close(() => {
      console.log("✅ Server closed");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Start server safely
const startServer = async () => {
  try {
    await connect();
    console.log("✅ MongoDB Connected");

    // ✅ Safe seeding (no async forEach bug)
    const mealCount = await Meal.countDocuments();
    if (mealCount === 0) {
      await Meal.insertMany(defaultMeals);
      console.log("🍽️ Default meals seeded into the database.");
    } else {
      console.log("🍽️ Meals already present. Skipping seed.");
    }

    if (!server) {
      server = app.listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 Server is running on port ${PORT}`);
      });
    }
  } catch (err) {
    console.error("❌ Startup error:", err);
    process.exit(1);
  }
};

// Run app
startServer();
