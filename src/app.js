import express from "express";
import cors from "cors";
import { config } from "dotenv";

config({ path: `./.env.${process.env.NODE_ENV}` });

// Init app instance
const app = express();

// Enable cors
app.use(cors());

// Enable handling of JSON data
app.use(express.json());

// Enable body parser
app.use(express.urlencoded({ extended: true }));

export default app;
