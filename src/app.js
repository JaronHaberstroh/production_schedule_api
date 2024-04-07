import express from "express";
import cors from "cors";
import { config } from "dotenv";
import unhanledRoutesHandler from "./middleware/unhandledRoutesHandler.js";

config({ path: `./.env.${process.env.NODE_ENV}` });

// Init app instance
const app = express();

// Enable cors
app.use(cors());

// Enable handling of JSON data
app.use(express.json());

// Enable body parser
app.use(express.urlencoded({ extended: true }));

// Handle unhandled routes
app.use(unhanledRoutesHandler);

export default app;
