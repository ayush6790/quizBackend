import mongoose, { Schema, Document } from "mongoose";

interface ICategory extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  topics: {
    title: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

const topicSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const categorySchema: Schema<ICategory> = new Schema<ICategory>(
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
    topics: [topicSchema], // Use the topicSchema as a subdocument schema
  },
  {
    timestamps: true,
  }
);

const CategoryModel = mongoose.model<ICategory>("QuizCategory", categorySchema);
export default CategoryModel;
