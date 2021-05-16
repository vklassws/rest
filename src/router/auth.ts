/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import Core from '@vws/core'
import { Router } from 'express'
import instances from '../instances'
import * as middles from '../middlewares'

export default Router()
	.post('/auth',
		middles.request(import('../schema/auth.json')),
		async (req, res) => {
			const core = new Core()

			await core.authenticate({
				username: req.body.username,
				password: req.body.password
			})

			instances.set(
				req.session,
				core
			)

			res.send()
		})
