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
          topics: req.body.topics,
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

const getQuestionById = async (req: any, res: Response, next: NextFunction) => {
  try {
    const question = await Question.find();
    if (question) {
      res.status(200).send({
        message: "get question successfully",
        data: question,
        statusCode: 200,
        success: true,
      });
    } else {
      throw generateError(`question does not exists`, 400);
    }
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req: any, res: Response, next: NextFunction) => {
  try {
    const category = await QuizCategory.findById(req.params.categoryId);
    if (category) {
      if (category.userId == req.userId) {
        const deletedCategory = await category.deleteOne();
        res.status(200).send({
          message: `${category.title} category has been deleted successfully`,
          data: deletedCategory,
          statusCode: 200,
          success: true,
        });
      } else {
        throw generateError(`cannot delete this category`, 403);
      }
    } else {
      throw generateError(
        `category does not exists or something went wrong`,
        400
      );
    }
  } catch (err) {
    next(err);
  }
};


const deleteQuestion = async (req: any, res: Response, next: NextFunction) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (question) {
      if (question.userId == req.userId) {
        const deletedQuestion = await question.deleteOne();
        res.status(200).send({
          message: `question has been deleted successfully`,
          data: deletedQuestion,
          statusCode: 200,
          success: true,
        });
      } else {
        throw generateError(`cannot delete this question`, 403);
      }
    } else {
      throw generateError(
        `question does not exists or something went wrong`,
        400
      );
    }
  } catch (err) {
    next(err);
  }
};

export {
  createCategory,
  getCategoryUserByAuthId,
  CreateQuestion,
  deleteCategory,
  deleteQuestion,
  getQuestionById,
};