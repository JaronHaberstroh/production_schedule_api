import readDocument from "#controllers/utils/readDocument.js";
import Department from "#models/department.js";
import AppError from "#utils/appError.js";

const readDepartment = async (req, res, next) => {
  try {
    // Extract department id from params
    const departmentId = req.params._id;

    // If departmentId provided add _id to params else {}
    const params = departmentId ? { _id: departmentId } : {};

    // Call readDocument helper function
    const result = await readDocument(Department, params);

    // Check if success
    if (!result.success) {
      throw new AppError(
        `Unable to find departments: ${result.message}`,
        result.statusCode || 500
      );
    }

    // Chekc if data
    if (result.data.length === 0) {
      throw new AppError(`No data returned from search:`, 404);
    }

    // Send success response
    res.status(200).json({
      statusCode: 200,
      success: true,
      message: `Successfully retrieved departments`,
      data: result.data,
      error: null,
    });
  } catch (error) {
    // Handle error
    next(
      new AppError(
        `Failed to find departments: ${error.message}`,
        error.statusCode || 500
      )
    );
  }
};

export default readDepartment;
