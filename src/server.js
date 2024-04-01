import app from "./app.js";
import { connectDB, disconnectDB } from "#mongoDB/mongooseSetup.js";

const PORT = process.env.PORT || 3000;

const DB_URI = process.env.MONGO_URI;

// Connect mongoDB
await connectDB();

console.log(`Connected to DB ${DB_URI}`);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
