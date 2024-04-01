import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

const connectDB = async () => {
  // Init mongoServer variable
  let mongoServer = null;

  try {
    // Init dbUrl variable and set it to .env value
    let mongoUrl = process.env.MONGO_URI;

    // Check if running tests
    if (process.env.NODE_ENV === "test") {
      // Create memory server for running tests
      mongoServer = await MongoMemoryServer.create();

      // Change dbUrl variable to memory server URI
      mongoUrl = mongoServer.getUri();
    }

    // Create connection to mongoose
    const mongoConnection = await mongoose.connect(mongoUrl, {});

    // Return variables
    return { mongoConnection, mongoServer, mongoUrl };
  } catch (error) {
    // Handle errors
    console.error("Issue with connecting to DB", error);
    process.exit(1);
  }
};

const disconnectDB = async (mongoConnection, mongoServer = null) => {
  try {
    if (mongoConnection) {
      // Close mongoose connection if present
      await mongoConnection.disconnect();
    }

    if (mongoServer) {
      // Close mongod server if present
      await mongoServer.stop();
    }
  } catch (error) {
    // Handle errors
    console.error("Issues closing DB connection", error);
  }
};

export { connectDB, disconnectDB };
