import createDocument from "#controllers/utils/createDocument.js";
import Department from "#models/department.js";
import AppError from "#utils/appError.js";

const createDepartment = async (req, res) => {
  // Extract req body
  const departmentData = req.body;

  // Check if department name provided
  if (!departmentData.departmentName) {
    throw new AppError(`Department name is required`, 400);
  }

  // Call createDocument helper function
  const result = await createDocument(Department, departmentData);

  // Check if success
  if (!result.success) {
    throw new AppError(
      `Unable to save Department: ${result.error.message}`,
      result.statusCode || 500
    );
  }

  // Send success response
  res.status(201).json({
    statusCode: 201,
    success: true,
    message: `New Department document successfully created`,
    data: result.data,
    error: null,
  });
};

export default createDepartment;
