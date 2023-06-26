import mongoose from "mongoose";

interface ICategory extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
}

const Category: mongoose.Schema<ICategory> = new mongoose.Schema<ICategory>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model<ICategory>('Category',Category)