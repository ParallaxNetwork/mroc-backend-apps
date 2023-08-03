import { Express } from 'express'

// import jwtRouter from '../routes/jwt.js'
import UserRouter from '../routes/user.js'
import IpfsRouter from '../routes/ipfs.js'
// import apiRouter from '../routes/api.js'
// import fileRouter from '../routes/file.js'
// import consentRouter from '../routes/consent.js'

export const routeConnect = async (app: Express) => {
  // app.use('/jwt', jwtRouter)
  app.use('/user', UserRouter)
  app.use('/ipfs', IpfsRouter)
  // app.use('/api', apiRouter)
  // app.use('/file', fileRouter)
  // app.use('/consent', consentRouter)

  console.log('Route connected')
}
