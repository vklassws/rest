/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { Router } from 'express'
import * as middles from '../middlewares'
import { loaders } from '@vws/core'

export default Router()
	.get('/schedule',
		middles.request(import('../schema/schedule.json')),
		middles.ensureInstance(),
		async (req, res) => {
			const core = req.core!
			res.send(await core.pipe(loaders.schedule.schedule()))
		})
