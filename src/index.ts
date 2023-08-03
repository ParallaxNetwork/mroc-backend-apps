import express, { Express } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import fileupload from 'express-fileupload'
import * as dotenv from 'dotenv'
dotenv.config()

const appExpress = (): Express => {
  const app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cors())
  app.use(fileupload())

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
