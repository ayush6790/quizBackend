import * as Joi from 'joi'

const CategoryValidation = Joi.object({
  title: Joi.string().min(3).max(120).required().messages({
    "string.min": "Title must have a minimum length of {#limit}",
    "string.max": "Title should not exceed a maximum length of {#limit}",
    "any.required": "Title is required",
  }),
  description: Joi.string().min(2).max(250).messages({
    "string.max": "Description should not exceed a maximum length of {#limit}",
    "string.min": "Description must have a minimum length of {#limit}",
  }).allow("").optional(),
  topics: Joi.array().items(Joi.object({
    title: Joi.string().min(3).max(120).required().messages({
      "string.min": "Topic title must have a minimum length of {#limit}",
      "string.max": "Topic title should not exceed a maximum length of {#limit}",
      "any.required": "Topic title is required",
    }),
    description: Joi.string().min(2).max(250).messages({
      "string.max": "Topic description should not exceed a maximum length of {#limit}",
      "string.min": "Topic description must have a minimum length of {#limit}",
    }).allow("").optional(),
  })).unique('title').messages({
    "array.unique": "Each topic title must be unique name",
  }),
}).options({
  abortEarly: false,
});

const answerSchema = Joi.object({
  answer: Joi.string().required().trim().messages({
    "string.min": "The answer field must contain at least one answer.",
    "any.required": "The answer field is required.",
  }),
  answerType: Joi.string().valid("image", "video", "text", "audio").default('text'),
  isCorrect: Joi.boolean().valid(true,false).required().default(false),
})

const questionValidation = Joi.object({
  categoryId: Joi.string().required().messages({
    "any.required": "The categoryId field is required.",
  }),
  question: Joi.string().min(12).required().trim().messages({
    "string.min": "The question field must contain at least one answer.",
    "any.required": "The question field is required.",
  }),
  description: Joi.string().trim(),
  questionType: Joi.string().valid("image", "video", "audio", "text").default("text"),
  answers: Joi.array().items(answerSchema).min(1).max(6).required().messages({
    "array.min": "The answers field must contain at least one answer.",
    "array.max": "The answers field must not exceed the maximum limit of six answers.",
    "any.required": "The answers field is required.",
  }),
}).options({
  abortEarly : false
});


export {CategoryValidation, questionValidation}