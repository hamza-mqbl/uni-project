import { error } from "console";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

// importing routes
import user from "./controller/user.js";
import post from "./controller/post.js";
import comment from "./controller/comment.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO) 
  .then(() => {
    console.log("mongodb is connected successfully");
  })
  .catch((error) => {
    console.log(error);
  });
const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://mern-blog-3vqj.onrender.com"],
    credentials: true,
  })
);

// defining routes
app.use("/api/v1", user);
app.use("/api/v1", post);
app.use("/api/v1", comment);
//  creating server
app.listen(5000, () => {
  console.log("server is running on port 5000");
});
app.use(express.static(path.join(__dirname, "/frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
