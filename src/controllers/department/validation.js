import Department from "#models/department.js";
import { param, body, validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors = JSON.stringify(
      errors.array().map((err) => ({ [err.path]: err.msg }))
    );
    return res.status(400).json(`Validation Error: ${extractedErrors}`, 400);
  }

  next();
};

const departmentNameValidator = () => {
  return [
    body("departmentName")
      .notEmpty()
      .withMessage("Field is required")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Department name must be at least 3 characterse long")
      .isAlphanumeric("en-US", { ignore: " " })
      .withMessage("Department name must be alphanumeric")
      .custom(async (value) => {
        const result = await Department.findOne({ departmentName: value });
        if (result) {
          throw new Error("Department already exists");
        }
      }),
  ];
};

const departmentIdValidator = () => {
  return [
    param("_id")
      .notEmpty()
      .withMessage("Field is required")
      .isMongoId()
      .withMessage("Must be a valid Mongo Id")
      .custom(async (value) => {
        const result = await Department.findOne({ _id: value });
        if (!result) {
          throw new Error("Department not found");
        }
      }),
  ];
};

export default validate;
export { departmentNameValidator, departmentIdValidator };
