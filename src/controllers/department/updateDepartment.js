import updateDocumment from "#controllers/utils/updateDocument.js";
import Department from "#models/department.js";
import AppError from "#utils/appError.js";

const updateDepartment = async (req, res) => {
  // Extract department data
  const departmentId = req.params._id;
  const params = req.body;

  // Check for department id
  if (!departmentId) {
    throw new AppError(`Department id is required`, 404);
  }

  // Check for department params
  if (!params) {
    throw new AppError(`Update requires changed properties be provided`, 404);
  }

  // Call update document helper function
  const result = await updateDocumment(Department, {
    query: departmentId,
    params: params,
  });

  // Check if success
  if (!result.success) {
    throw new AppError(
      `Failed to update document: ${result.error.message}`,
      result.statusCode || 500
    );
  }

  // Send successful response
  res.status(200).json({
    statusCode: 200,
    success: true,
    message: "test message",
    data: "test data",
    error: null,
  });
};

export default updateDepartment;
