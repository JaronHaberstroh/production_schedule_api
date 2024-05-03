import { Schema, model } from "mongoose";

export const workPositionSchema = new Schema({
  positionName: {
    type: String,
    required: [true, "positionName is required"],
  },
});

const WorkPosition = model("WorkPosition", workPositionSchema);

export default WorkPosition;
