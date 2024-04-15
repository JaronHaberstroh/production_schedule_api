import updateDocumment from "#controllers/utils/updateDocument.js";
import Department from "#models/department.js";
import AppError from "#utils/appError.js";

const updateDepartment = async (req, res, next) => {
  try {
    // Extract department data
    const departmentId = req.params._id;
    const params = req.body;

    // Check for department id
    if (!departmentId) {
      throw new AppError(`Department id is required`, 400);
    }

    // Check for department params
    if (Object.keys(params).length === 0) {
      throw new AppError(`Update requires changed properties be provided`, 400);
    }

    // Call update document helper function
    const result = await updateDocumment(Department, {
      query: departmentId,
      params: params,
    });

    // Check if success
    if (!result.success) {
      throw new AppError(
        `Document was not updated successfully: ${result.message}`,
        result.statusCode || 500
      );
    }

    // Send successful response
    res.status(200).json({
      statusCode: 200,
      success: true,
      message: `Successfully updated document`,
      data: result,
      error: null,
    });
  } catch (error) {
    // Handle errors
    next(
      new AppError(
        `Failed to update document: ${error.message}`,
        error.statusCode || 500
      )
    );
  }
};

export default updateDepartment;
