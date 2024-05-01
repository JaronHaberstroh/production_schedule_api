import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose from "mongoose";

const connectDB = async () => {
  // Init mongoServer variable
  let mongoReplSet = null;

  try {
    // Init dbUrl variable and set it to .env value
    let mongoUrl = process.env.MONGO_URI;

    // Check if running tests
    if (process.env.NODE_ENV === "test") {
      // Create memory server for running tests
      mongoReplSet = await MongoMemoryReplSet.create({
        replSet: { count: 3, storageEngine: "wiredTiger" },
      });

      // Change dbUrl variable to memory server URI
      mongoUrl = mongoReplSet.getUri();
    }

    // Create connection to mongoose
    const mongoConnection = await mongoose.connect(mongoUrl, {});

    // Return variables
    return { mongoConnection, mongoReplSet, mongoUrl };
  } catch (error) {
    // Handle errors
    console.error("Issue with connecting to DB", error);
    process.exit(1);
  }
};

const disconnectDB = async (mongoConnection, mongoReplSet = null) => {
  try {
    if (mongoConnection) {
      // Close mongoose connection if present
      await mongoConnection.disconnect();
    }

    if (mongoReplSet) {
      // Close mongod server if present
      await mongoReplSet.stop();
    }
  } catch (error) {
    // Handle errors
    console.error("Issues closing DB connection", error);
  }
};

export { connectDB, disconnectDB };
