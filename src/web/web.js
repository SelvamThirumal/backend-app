import express from "express";
import authRouter from "./routes/auth.route.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.use("/auth", authRouter);

export default router;
