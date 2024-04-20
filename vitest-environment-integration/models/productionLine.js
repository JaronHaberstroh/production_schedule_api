import mongoose, { Schema, model } from "mongoose";

export const productionLineSchema = new Schema({
  lineName: {
    type: String,
    required: [true, "Line name field is required"],
  },
  department: {
    type: mongoose.Types.ObjectId,
    required: [true, "Department relation is required"],
    ref: "Department",
  },
  linePositions: [
    {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "LinePositions",
    },
  ],
});

const ProductionLine = model("ProductionLine", productionLineSchema);

export default ProductionLine;
