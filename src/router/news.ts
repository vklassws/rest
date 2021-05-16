/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { Router } from 'express'
import * as middles from '../middlewares'
import { loaders } from '@vws/core'

export default Router()
	.get('/news',
		middles.request(import('../schema/news.json')),
		middles.ensureInstance(),
		async (req, res) => {
			const core = req.core!
			res.send(await core.pipe(loaders.news.news()))
		})

	.get('/news/details',
		middles.request(import('../schema/news/details.json')),
		middles.ensureInstance(),
		async (req, res) => {
			const core = req.core!
			const { id } = req.body
			res.send(await core.pipe(loaders.news.details(id)))
		})
