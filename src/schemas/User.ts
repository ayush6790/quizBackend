import mongoose, { Schema, Document } from 'mongoose';

interface UserInterface extends Document {
  name: string;
  username: string;
  pic: string;
  is_active: string;
  role: string;
  password: string;
}

const UserSchema: Schema<UserInterface> = new Schema<UserInterface>({
  name: { type: String, required: true },
  username: { type: String, required: true },
  pic: { type: String, required: true },
  is_active: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
    required: true,
  },
  password: { type: String, required: true },
});

const UserModel = mongoose.model<UserInterface>('User', UserSchema);

export default UserModel;
