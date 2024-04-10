import deleteDocument from "#controllers/utils/deleteDocument.js";
import Department from "#models/department.js";
import AppError from "#utils/appError.js";

const deleteDepartment = async (req, res) => {
  // Extract department _id from params
  const departmentId = req.params._id;

  // Check that _id is provided
  if (!departmentId) {
    throw new AppError("Department _id is required", 400);
  }

  // Call deleteDocument helper function
  const result = await deleteDocument(Department, { _id: departmentId });

  // Check if successful
  if (!result.success) {
    throw new AppError(
      `Failed to delete Department: ${result.error.message}`,
      result.statusCode || 500
    );
  }

  // Send success response
  res.status(200).json({
    statusCode: 200,
    success: true,
    message: `Successfully deleted Department`,
    data: result,
    error: null,
  });
};

export default deleteDepartment;
