import { Express } from 'express'

// import jwtRouter from '../routes/jwt.js'
import UserRouter from '../routes/user.js'
import FileRouter from '../routes/file.js'
import ConsentRouter from '../routes/consent.js'
import TestRouter from '../routes/test.js'

export const routeConnect = async (app: Express) => {
  // app.use('/jwt', jwtRouter)
  app.use('/user', UserRouter)
  app.use('/file', FileRouter)
  app.use('/consent', ConsentRouter)
  app.use('/test', TestRouter)

  console.log('Route connected')
}
