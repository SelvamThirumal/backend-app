import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

async function createjwtToken(data) {
  return jwt.sign(data, "mySecretKey");
}

export { createjwtToken };
