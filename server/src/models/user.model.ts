import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    unique: true,
  },
  lastname: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export interface IUser extends mongoose.Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  date: string;
}

const User = mongoose.model<IUser>("user", userSchema);

export default User;
