import Department from "#models/department.js";
import ProductionLine from "#models/productionLine.js";
import mongoose from "mongoose";

describe("ProductionLine model", () => {
  let testData = [];
  let testDepartments = [];
  beforeAll(async () => {
    for (let i = 1; i <= 5; i++) {
      const department = new Department({
        departmentName: `Department ${i}`,
        productionLines: [],
      });
      testDepartments.push(department);
      await department.save();
    }

    for (let i = 0; i <= testDepartments.length - 1; i++) {
      for (let j = 1; j <= 5; j++) {
        const productionLine = new ProductionLine({
          lineName: `Production Line ${j}`,
          department: testDepartments[i]._id,
        });
        testDepartments[i].productionLines.push(productionLine);
        testData.push(productionLine);
      }
    }
  });

  test("should create and save production lines successfully", async () => {
    const validProductionLine = new ProductionLine(testData[0]);

    const savedProductionLine = await validProductionLine.save();

    expect(savedProductionLine._id).toBeDefined();
    expect(savedProductionLine.lineName).toBe(testData[0].lineName);
  });

  test("shouldn't be able to insert undefined fields", async () => {
    const lineWithInvalidFields = new ProductionLine({
      lineName: testData[1].lineName,
      department: testData[1].department,
      invalidField: "invalid",
    });
    const savedProductionLine = await lineWithInvalidFields.save();

    expect(savedProductionLine._id).toBeDefined();
    expect(savedProductionLine.invalidField).toBeUndefined();
  });

  test("should fail when required fields not provided", async () => {
    const lineWithoutRequiredFields = new ProductionLine({});

    const saveProductionLine = async () => {
      await lineWithoutRequiredFields.save();
    };

    expect(saveProductionLine).rejects.toThrowError(
      mongoose.Error.ValidationError
    );
  });
});
