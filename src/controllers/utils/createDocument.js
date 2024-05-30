const createDocument = (model, params) => {
  return new model(params);
};

export default createDocument;
