import { NextFunction, Response } from "express";
import QuizCategory from "../../schemas/Quiz/Category";
import { generateError } from "../config/function";
import { CategoryValidation, questionValidation } from "./utils/validation";
import Question from "../../schemas/Quiz/Question";
import { PaginationLimit } from "../config/constant";

const createCategory = async (req: any, res: Response, next: NextFunction) => {
  try {
    const result = CategoryValidation.validate(req.body);
    if (result.error) {
      throw generateError(result.error.details[0], 422);
    } else {
      const existCategory = await QuizCategory.findOne({
        title: req.body.title.trim(),
        userId: req.userId,
      });
      if (existCategory) {
        throw generateError(
          `${req.body.title} category is already exists`,
          400
        );
      } else {
        const createdQuiz = new QuizCategory({
          userId: req.userId,
          title: req.body.title,
          description: req.body.description,
        });
        const savedQuiz = await createdQuiz.save();
        if (savedQuiz) {
          return res.status(201).send({
            message: `${req.body.title} category is created successfully`,
            data: savedQuiz,
            statusCode: 201,
            success: true,
          });
        } else {
          throw generateError(`cannot create category , try again later`, 400);
        }
      }
    }
  } catch (err: any) {
    next(err);
  }
};

const getCategoryUserByAuthId = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || PaginationLimit;
    const categories = await QuizCategory.find({ userId: req.userId })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
    res.status(200).send({
      message: "Get Categories successfully",
      data: categories,
      success: true,
      statusCode: 200,
    });
  } catch (err) {
    next(err);
  }
};

// Questions.

const CreateQuestion = async (req: any, res: Response, next: NextFunction) => {
  try {
    const result = questionValidation.validate(req.body);
    if (result.error) {
      throw generateError(result.error.details[0], 422);
    } else {
      const createdQuestion = new Question({
        question: req.body.question,
        categoryId: req.body.categoryId,
        description: req.body.description,
        questionType: req.body.questionType,
        userId: req.userId,
        answers: req.body.answers,
      });
      const savedQuestion = await createdQuestion.save();
      if (savedQuestion) {
        return res.status(201).send({
          data: savedQuestion,
          message: `New Question has been created`,
          statusCode: 200,
          success: true,
        });
      } else {
        throw generateError(
          `Cannot create the question, try again later!`,
          400
        );
      }
    }
  } catch (err: any) {
    next(err);
  }
};

export { createCategory, getCategoryUserByAuthId, CreateQuestion };
