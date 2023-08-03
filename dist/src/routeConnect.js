// import jwtRouter from '../routes/jwt.js'
import UserRouter from '../route/user.js';
// import ipfsRouter from '../routes/ipfs.js'
// import apiRouter from '../routes/api.js'
// import fileRouter from '../routes/file.js'
// import consentRouter from '../routes/consent.js'
export const routeConnect = async (app) => {
    // app.use('/jwt', jwtRouter)
    app.use('/user', UserRouter);
    // app.use('/ipfs', ipfsRouter)
    // app.use('/api', apiRouter)
    // app.use('/file', fileRouter)
    // app.use('/consent', consentRouter)
    console.log('Route connected');
};
//# sourceMappingURL=routeConnect.js.map