import { errorResponse, successResponse } from "#responses/response";

const editDocumentList = (document, kwargs) => {
  const { documentList, action, subDocId } = kwargs;

  if (!document[documentList]) {
    return errorResponse(`Document list ${documentList} does not exist`, 400);
  }

  switch (action) {
    case "pull":
      document[documentList].pull(subDocId);
      break;
    case "push":
      document[documentList].push(subDocId);
      break;
    default:
      return errorResponse("Action not provided", 400);
  }

  return successResponse(`Successfully edited ${documentList}`, 200, document);
};

export default editDocumentList;
