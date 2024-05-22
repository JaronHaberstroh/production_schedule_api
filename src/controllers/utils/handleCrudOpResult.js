import { successResponse } from "#responses/response";

const handleCrudOpResult = (res, result) => {
  if (!result.success) {
    return result.error;
  }

  res
    .status(result.statusCode)
    .json(successResponse(result.message, result.statusCode, result.data));
};

export default handleCrudOpResult;
