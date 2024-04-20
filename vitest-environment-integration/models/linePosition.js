import mongoose, { Schema, model } from "mongoose";

export const linePositionSchema = new Schema({
  productionLine: {
    type: mongoose.Types.ObjectId,
    required: [true, "Production line relation is required"],
    ref: "ProductionLine",
  },
  workPositions: [
    {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "WorkPosition",
    },
  ],
});

const LinePosition = model("LinePosition", linePositionSchema);

export default LinePosition;
