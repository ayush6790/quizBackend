import express from 'express'
import authenticate from '../modules/config/authenticate'
import { CreateQuestion, createCategory, deleteQuestion, getCategoryUserByAuthId, getQuestionById, deleteCategory } from '../modules/Quiz/Quiz'

const router = express.Router()

router.post('/category/create',authenticate,createCategory)
router.get('/auth/categories',authenticate,getCategoryUserByAuthId)
router.post('/question/create',authenticate,CreateQuestion)
router.get('/question/:questionId',getQuestionById)
router.delete('/question/:questionId',authenticate,deleteQuestion)
router.delete('/category/:categoryId',authenticate,deleteCategory)

export default router;