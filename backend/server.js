import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import studentRoutes from "./routes/student.route.js";
import placementTeamRoutes from "./routes/placement-team.route.js";

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "https://thapar-nexus.netlify.app",
    credentials: true,
  })
);

app.options(
  "*",
  cors({
    origin: "https://thapar-nexus.netlify.app", // Ensure that the preflight also allows the Netlify domain
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/placement-team", placementTeamRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  connectDB();
});
