import express from 'express'
import fs from 'fs'
import https from 'https'
import Core from '@vws/core'
import * as middlewares from './middlewares'
import router from './router/index'
import helmet from 'helmet'
import sessions from 'client-sessions'

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		interface Request {
			session: string
			core?: Core
		}
	}
}

async function main() {
	let port: number, key: string,
		cert: string, secret: string

	if (process.env.PORT) {
		port = parseInt(process.env.PORT)
	} else if (process.env.PORT_FILE) {
		port = parseInt(fs.readFileSync(process.env.PORT_FILE, 'utf-8'))
	} else {
		port = 443
	}

	if (process.env.KEY) {
		key = process.env.KEY
	} else if (process.env.KEY_FILE) {
		key = fs.readFileSync(process.env.KEY_FILE, 'utf-8')
	} else {
		try {
			key = fs.readFileSync('key.pem', 'utf-8')
		} catch {
			throw new Error('\'KEY\' and \'KEY_FILE\' is missing in env.')
		}
	}

	if (process.env.CERT) {
		cert = process.env.CERT
	} else if (process.env.CERT_FILE) {
		cert = fs.readFileSync(process.env.CERT_FILE, 'utf-8')
	} else {
		try {
			cert = fs.readFileSync('cert.pem', 'utf-8')
		} catch {
			throw new Error('\'CERT\' and \'CERT_FILE\' is missing in env.')
		}
	}

	if (process.env.SECRET) {
		secret = process.env.SECRET
	} else if (process.env.SECRET_FILE) {
		secret = fs.readFileSync(process.env.SECRET_FILE, 'utf-8').split('\n')[0]

		if (!secret) {
			throw new Error('Secret is invalid.')
		}
	} else {
		try {
			secret = fs.readFileSync('secret.txt', 'utf-8').split('\n')[0]

			if (!secret) {
				throw new Error('Secret is invalid.')
			}
		} catch {
			throw new Error('\'SECRET\' and \'SECRET_FILE\' is missing in env.')
		}
	}

	const app = express()

	app.use(helmet())
	app.use((
		_req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		res.setHeader('X-Powered-By', 'electricity')
		next()
	})
	app.use(express.urlencoded({
		extended: true
	}))
	app.use(express.json())
	app.use(sessions({ secret }))
	app.use(middlewares.instanceFromSession())
	app.use(router)
	app.use(middlewares.notFound())
	app.use(middlewares.errorHandler())

	const server = https.createServer({
		key: key,
		cert: cert
	}, app)

	server.listen(port, () => {
		console.log(`HTTPS Rest server is running on ':${port}'`)
	})
}

main()
