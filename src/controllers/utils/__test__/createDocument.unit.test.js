import createDocument from "../createDocument.js";

describe("createDocumnet()", () => {
  let mockModel, mockParams;
  beforeAll(() => {
    mockModel = vi.fn();

    mockParams = { name: "test name", age: 44 };
  });

  test("should return document created with given Model and params", () => {
    mockModel.mockImplementation((params) => {
      return { ...params };
    });

    const document = createDocument(mockModel, mockParams);

    expect(mockModel).toBeCalledWith(mockParams);
    expect(document).toEqual({ ...mockParams });
  });
});
