import express from 'express'
import instances from './instances'
import Ajv from 'ajv'

export function instanceFromSession() {
	return function (
		req: express.Request,
		_res: express.Response,
		next: express.NextFunction
	): void {
		req.core = instances.get(req.session)
		next()
	}
}

export function ensureInstance() {
	return function (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): void {
		const core = req.core
		if (core)
			next()
		else
			res.status(401).end()
	}
}

export function errorHandler() {
	return function (
		err: unknown,
		_req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): void {
		if (err) {
			res.status(500).end()
		} else {
			next()
		}
	}
}

const requestValidator = new Ajv()
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function request(schema: Promise<any>) {
	return async function (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> {
		if (requestValidator.validate(await schema, req.body)) {
			next()
		} else {
			res.status(400).end()
		}
	}
}

export function notFound() {
	return function (
		_req: express.Request,
		res: express.Response
	): void {
		res.status(404).end()
	}
}
