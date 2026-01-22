// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Import database connection and express app
import connect from "./db/mongoDB.js";
import app from "./app.js";

// Import the Meal model
import Meal from "./models/meal/meal.model.js";
import { getDate_24_HH_MM } from "./utils/date_time_utils.js";

// Get port from env or default
const PORT = 2000;

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

// Connect to MongoDB, seed meals if needed, and start server
connect().then(async () => {
  // Check and seed meals
  const mealCount = await Meal.countDocuments();
  if (mealCount === 0) {
    await defaultMeals.forEach(async (meal) => await Meal.create(meal)); // ✅ Use this
    console.log("🍽️  Default meals seeded into the database.");
  } else {
    console.log("🍽️  Meals already present. Skipping seed.");
  }

  // Start server
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
});
