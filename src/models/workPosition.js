import { Schema, model } from "mongoose";

export const workPositionsSchema = new Schema({
  positionName: {
    type: String,
    required: [true, "positionName is required"],
  },
});

const WorkPosition = model("WorkPosition", workPositionsSchema);

export default WorkPosition;
