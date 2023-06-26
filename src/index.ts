import "./db/db";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import errorMiddleware from "./modules/config/errorHandler";
import cors from "cors";
import importRoutings from "./routing/routingIndex";
// import './services/email/RegisterEmail/Templates/SendMail'

const app = express();
dotenv.config();

// use the body-parser
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Enable CORS for all routes and all origins
app.use(cors());

// import routing function
importRoutings(app)

// Apply the error handler middleware
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`The server is running on port ${process.env.PORT}`);
});
