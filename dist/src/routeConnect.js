// import jwtRouter from '../routes/jwt.js'
import UserRouter from '../routes/user.js';
import FileRouter from '../routes/file.js';
import ConsentRouter from '../routes/consent.js';
export const routeConnect = async (app) => {
    // app.use('/jwt', jwtRouter)
    app.use('/user', UserRouter);
    app.use('/file', FileRouter);
    app.use('/consent', ConsentRouter);
    console.log('Route connected');
};
//# sourceMappingURL=routeConnect.js.map