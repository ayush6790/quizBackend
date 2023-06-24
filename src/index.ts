import "./db/db";
import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import userRouting from "./routing/User";
import errorMiddleware from "./model/config/errorHandler";
import cors from 'cors';

const app = express();
dotenv.config();

// use the body-parser
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Enable CORS for all routes and all origins
app.use(cors());

// Import routes
app.use("/api/auth", userRouting);

// Apply the error handler middleware
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`The server is running on port ${process.env.PORT}`);
});
