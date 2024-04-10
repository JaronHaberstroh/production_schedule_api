import readDocument from "#controllers/utils/readDocument.js";
import Department from "#models/department.js";
import AppError from "#utils/appError.js";

const readDepartment = async (req, res) => {
  // Extract department id from params
  const departmentId = req.params._id;

  // Call readDocument helper function
  const result = await readDocument(Department, { _id: departmentId });

  // Check if success
  if (!result.success) {
    throw new AppError(
      `Failed to find departments: ${result.error.message}`,
      result.statusCode || 500
    );
  }

  // Chekc if data
  if (!result.data) {
    throw new AppError(
      `No data returned for search: Error`,
      result.statusCode || 404
    );
  }

  // Send success response
  res.status(200).json({
    statusCode: 200,
    success: true,
    message: "test message",
    data: "test data",
    error: null,
  });
};

export default readDepartment;
