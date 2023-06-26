import express from 'express'
import authenticate from '../modules/config/authenticate'
import { CreateQuestion, createCategory, getCategoryUserByAuthId } from '../modules/Quiz/Quiz'

const router = express.Router()

router.post('/category/create',authenticate,createCategory)
router.get('/auth/categories',authenticate,getCategoryUserByAuthId)
router.post('/question/create',authenticate,CreateQuestion)
export default router;