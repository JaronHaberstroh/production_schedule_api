import { Schema, model } from "mongoose";

export const userRoleSchema = new Schema({
  isSuper: {
    type: Boolean,
    required: false,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const userSchema = new Schema({
  fName: {
    type: String,
    required: [true, "First name is required"],
  },
  lName: {
    type: String,
    required: [true, "Last name is required"],
  },
  employeeNumber: {
    type: Number,
    required: [true, "EmployeeNumber is required"],
  },
  shift: {
    type: String,
    required: [true, "Shift is required"],
  },
  currentPosition: {
    type: String,
    required: [true, "Current working position is required"],
    default: "Laborer",
  },
  startDate: {
    type: Date,
    required: false,
  },
  userRole: {
    type: [userRoleSchema],
    required: false,
  },
});
const User = model("User", userSchema);

export default User;
