import createDocument from "#controllers/utils/createDocument.js";
import Department from "#models/department.js";
import AppError from "#utils/appError.js";

const createDepartment = async (req, res, next) => {
  try {
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
        `Failed to create document: ${result.message}`,
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
  } catch (error) {
    // Handle errors
    next(
      new AppError(
        `Unable to save Department: ${error.message}`,
        error.statusCode || 500
      )
    );
  }
};

export default createDepartment;
