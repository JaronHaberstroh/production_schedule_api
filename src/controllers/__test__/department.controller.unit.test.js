import * as departmentController from "#controllers/department.controller";
import * as departmentService from "src/services/department/department.service";
import { successResponse } from "#responses/response";

vi.mock("src/services/department/department.service");
vi.mock("#responses/response");

describe("Department controller", () => {
  let req, res, next;
  let params, departmentDocument, error;
  beforeEach(() => {
    req = {
      params: { _id: "test department id" },
      body: { name: "department name" },
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();

    departmentDocument = { ...req.params, ...req.body };

    error = new Error("failed message");
  });

  describe("createDepartment()", () => {
    beforeEach(() => {
      params = req.body;
    });

    test("should handle req and pass information to department service", async () => {
      departmentService.addDepartment.mockResolvedValueOnce(departmentDocument);

      await departmentController.createDepartment(req, res, next);

      expect(departmentService.addDepartment).toBeCalledWith(params);
    });

    test("should handle res object", async () => {
      departmentService.addDepartment.mockResolvedValueOnce(departmentDocument);

      await departmentController.createDepartment(req, res, next);

      expect(successResponse).toBeCalled();
      expect(res.status).toBeCalled();
      expect(res.json).toBeCalled();
    });

    test("should pass errors to next", async () => {
      departmentService.addDepartment.mockResolvedValue({ error: error });

      await departmentController.createDepartment(req, res, next);

      expect(next).toBeCalledWith(error);
    });
  });

  describe("readDepartment()", () => {
    beforeEach(() => {
      req = {
        params: { _id: "test department id" },
        body: { name: "department name" },
      };
    });

    test("should handle calls without params", async () => {
      req = { params: {}, body: {} };

      departmentService.fetchAllDepartments.mockResolvedValueOnce(
        departmentDocument,
      );

      await departmentController.readDepartment(req, res, next);

      expect(departmentService.fetchAllDepartments).toBeCalledWith({});
    });

    test("should handle calls with id", async () => {
      departmentService.fetchDepartmentById.mockResolvedValueOnce(
        departmentDocument,
      );

      await departmentController.readDepartment(req, res, next);

      expect(departmentService.fetchDepartmentById).toBeCalledWith(
        req.params._id,
      );
    });

    test("should handle call with params", async () => {
      req = { params: {} };

      departmentService.fetchAllDepartments.mockResolvedValueOnce(
        departmentDocument,
      );

      await departmentController.readDepartment(req, res, next);

      expect(departmentService.fetchAllDepartments).toBeCalledWith(req.body);
    });

    test("should handle res object", async () => {
      departmentService.fetchDepartmentById.mockResolvedValueOnce(
        departmentDocument,
      );

      await departmentController.readDepartment(req, res, next);

      expect(successResponse).toBeCalled();
      expect(res.status).toBeCalled();
      expect(res.json).toBeCalled();
    });

    test("should handle errors", async () => {
      departmentService.fetchDepartmentById.mockResolvedValueOnce({
        error: error,
      });

      await departmentController.readDepartment(req, res, next);

      expect(next).toBeCalledWith(error);
    });
  });

  describe("updateDepartment()", () => {
    beforeEach(() => {});

    test("should handle req and pass information to department service", async () => {
      departmentService.editDepartment.mockResolvedValueOnce(
        departmentDocument,
      );

      await departmentController.updateDepartment(req, res, next);

      expect(departmentService.editDepartment).toBeCalledWith(
        req.params._id,
        params,
      );
    });

    test("should handle res object", async () => {
      departmentService.editDepartment.mockResolvedValueOnce(
        departmentDocument,
      );

      await departmentController.updateDepartment(req, res, next);

      expect(successResponse).toBeCalled();
      expect(res.status).toBeCalled();
      expect(res.json).toBeCalled();
    });

    test("should handle errors", async () => {
      departmentService.editDepartment.mockResolvedValueOnce({ error: error });

      await departmentController.updateDepartment(req, res, next);

      expect(next).toBeCalledWith(error);
    });
  });

  describe("deleteDepartment()", () => {
    beforeEach(() => {});

    test("should handle req and pass information to department service", async () => {
      departmentService.removeDepartment.mockResolvedValueOnce({});

      await departmentController.deleteDepartment(req, res, next);

      expect(departmentService.removeDepartment).toBeCalledWith(req.params._id);
    });

    test("should handle res object", async () => {
      departmentService.removeDepartment.mockResolvedValueOnce({});

      await departmentController.deleteDepartment(req, res, next);

      expect(successResponse).toBeCalled();
      expect(res.status).toBeCalled();
      expect(res.json).toBeCalled();
    });

    test("should handle errors", async () => {
      departmentService.removeDepartment.mockResolvedValueOnce({
        error: error,
      });

      await departmentController.deleteDepartment(req, res, next);

      expect(next).toBeCalledWith(error);
    });
  });
});
