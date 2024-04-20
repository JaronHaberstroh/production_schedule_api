import mongoose, { Schema, model } from "mongoose";

export const departmentSchema = new Schema({
  departmentName: {
    type: String,
    required: [true, "Department name field is required"],
  },
  productionLines: [
    {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "ProductionLine",
    },
  ],
});

const Department = model("Department", departmentSchema);

export default Department;
