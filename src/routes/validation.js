import { errorResponse } from "#responses/response.js";
import { param, body, validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors = JSON.stringify(
      errors.array().map((err) => ({ [err.path]: err.msg }))
    );
    return res
      .status(400)
      .json(errorResponse(`Validation Error: ${extractedErrors}`, 400));
  }
  next();
};

const checkName = (field, Model) => {
  return [
    body(field)
      .trim()
      .notEmpty()
      .withMessage(`${field} field is required`)
      .isLength({ min: 3 })
      .withMessage(`${field} must be at least 3 characterse long`)
      .isAlphanumeric("en-US", { ignore: " " })
      .withMessage(`${field} must be alphanumeric`)
      .custom(async (value) => {
        const result = await Model.findOne({ [field]: value });
        if (result) {
          throw new Error(`${Model.modelName} already exists`);
        }
      }),
  ];
};

const checkId = (Model) => {
  return [
    param("_id")
      .trim()
      .notEmpty()
      .withMessage("Field is required")
      .isMongoId()
      .withMessage("Must be a valid Mongo Id")
      .custom(async (value) => {
        const result = await Model.findOne({ _id: value });
        if (!result) {
          throw new Error(`${Model.modelName} not found"`);
        }
      }),
  ];
};

export { validate, checkName, checkId };
