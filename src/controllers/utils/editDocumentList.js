import { errorResponse } from "#responses/response";

const editDocumentList = (document, kwargs) => {
  const { documentList, action, subDocId } = kwargs;

  try {
    switch (action) {
      case "pull":
        document[documentList].pull(subDocId);
        break;
      case "push":
        document[documentList].push(subDocId);
        break;
      default:
        return errorResponse(`Action not provided`, 500);
    }

    return document;
  } catch (error) {
    return errorResponse(error.message, error.statusCode);
  }
};

export default editDocumentList;
