import { Router } from 'express'

/* Alphabetical order */
import Auth from './auth'
import Feed from './feed'
import News from './news'
import Schedule from './schedule'

const router = Router()

router.use(Auth)
router.use(Feed)
router.use(News)
router.use(Schedule)

export default router
