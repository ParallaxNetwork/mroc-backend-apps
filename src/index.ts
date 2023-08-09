import express, { Express } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import fileupload from 'express-fileupload'
import * as dotenv from 'dotenv'
import busboy from 'connect-busboy'
dotenv.config()

const appExpress = (): Express => {
  const app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cors())
  app.use(fileupload())
  app.use(cookieParser())
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 10 * 10,
        httpOnly: true,
        secure: false,
      },
    })
  )
  app.use(
    busboy({
      highWaterMark: 2 * 1024 * 1024,
    })
  )

  return app
}

const appServer = appExpress()

//* connect mongoose
import mongoose from 'mongoose'
mongoose.set('strictQuery', false)
mongoose.connect(process.env.DATABASE_URL)

//* connect router
import { routeConnect } from './routeConnect.js'
await routeConnect(appServer)

//* connect express
const port = process.env.PORT || 3001
appServer.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
