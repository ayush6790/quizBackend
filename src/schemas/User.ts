import mongoose, { Schema, Document } from "mongoose";

interface UserInterface extends Document {
  name: string;
  username: string;
  pic: string;
  is_active: boolean;
  role: string;
  password: string;
}

const UserSchema: Schema<UserInterface> = new Schema<UserInterface>({
  name: { type: String, required: true },
  username: { type: String, required: true, index: true },
  pic: { type: String },
  is_active: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  password: { type: String, required: true },
});

const UserModel = mongoose.model<UserInterface>("User", UserSchema);

export default UserModel;
