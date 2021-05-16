/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { Router } from 'express'
import * as middles from '../middlewares'
import { loaders } from '@vws/core'

export default Router()
	.get('/feeds',
		middles.request(import('../schema/feeds.json')),
		middles.ensureInstance(),
		async (req, res) => {
			const core = req.core!
			res.send(await core.pipe(loaders.feed.feeds()))
		})
