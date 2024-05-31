import updateDocumment from "../updateDocument.js";

describe("updateDocument()", () => {
  const document = { _id: "test id", name: "original name" };

  test("should return updated document with merged properties", () => {
    const params = { name: "updated name" };

    const result = updateDocumment({ ...document }, params);

    const expectedResult = { _id: "test id", name: "updated name" };

    expect(result).toEqual(expectedResult);
  });

  test("should add new fields", () => {
    const params = { age: 34, time: "now" };

    const result = updateDocumment({ ...document }, params);

    const expectedResult = {
      _id: "test id",
      name: "original name",
      age: 34,
      time: "now",
    };

    expect(result).toEqual(expectedResult);
  });

  test("should return original document if params are empty", () => {
    const params = {};

    const result = updateDocumment({ ...document }, params);

    expect(result).toEqual(document);
  });
});
