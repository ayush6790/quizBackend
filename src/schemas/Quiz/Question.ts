import mongoose, { Schema, Document } from "mongoose";

interface IAnswer extends Document {
  answer: string;
  answerType: string;
  isCorrect: boolean;
}

interface IQuestion extends Document {
  userId: Schema.Types.ObjectId;
  categoryId: Schema.Types.ObjectId;
  question: string;
  description: string;
  questionType: string;
  answers: IAnswer[];
}

const AnswerSchema: Schema<IAnswer> = new Schema<IAnswer>({
  answer: {
    type: String,
    required: true,
    trim: true,
  },
  answerType: {
    type: String,
    enum: ["image", "video", "text", "audio"],
  },
  isCorrect: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const QuestionSchema: Schema<IQuestion> = new Schema<IQuestion>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      required:true,
      index: true,
    },
    question: {
      type: String,
      trim: true,
      index: true,
    },
    questionType: {
      type: String,
      enum: ["image,video,audio,text"],
      default: "text",
    },
    description: {
      type: String,
      trim: true,
    },
    answers: [AnswerSchema],
  },
  { timestamps: true }
);

const QuestionModel = mongoose.model<IQuestion>("Question", QuestionSchema);
export default QuestionModel;
