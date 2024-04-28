import { connectDB, disconnectDB } from "#mongoDB/mongooseSetup.js";

export default {
  name: "integration-env",
  transformMode: "ssr",
  async setup() {
    // Init DB variables
    let mongoConnection, mongoServer;

    // Connect to DB
    ({ mongoConnection, mongoServer } = await connectDB());

    globalThis.mongoConnection = mongoConnection;
    globalThis.mongoServer = mongoServer;
    globalThis.seedDB = seedDB;
    return {
      async teardown() {
        // Disconnect from DB
        disconnectDB(mongoConnection, mongoServer);
      },
    };
  },
};

const seedDB = async (models) => {
  const { Department, ProductionLine } = models;

  let departments;
  if (Department) {
    departments = Array.from(
      { length: 5 },
      (_, idx) =>
        new Department({
          departmentName: `Department_${idx + 1}`,
          productionLines: [],
        })
    );
  }

  if (ProductionLine) {
    for (let i = 0; i < departments.length; i++) {
      const productionLines = Array.from(
        { length: 5 },
        (_, idx) =>
          new ProductionLine({
            lineName: `ProductionLine_${idx + 1}`,
            department: departments[i]._id,
          })
      );
      const savedProductionLines = await ProductionLine.insertMany(
        productionLines
      );
      departments[i].productionLines.push(
        ...savedProductionLines.map((line) => line._id)
      );
    }
  }
  await Department.insertMany(departments);
};
