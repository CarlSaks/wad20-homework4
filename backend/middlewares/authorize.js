const { verifyAccessToken } = require('../library/jwt');
const UserModel = require('../models/UserModel');

module.exports = (request, response, next) => {

    // This is the place where you will need to implement authorization
    /*
        Pass access token in the Authorization header and verify
        it here using 'jsonwebtoken' dependency. Then set request.currentUser as
        decoded user from access token.
    */

    if (request.headers.authorization) {
        const accessToken = request.headers.authorization.slice(7);
        const authorized = verifyAccessToken(accessToken);

        if (!authorized) {
            response.status(401).json('unauthorized')
            return;
        }

        UserModel.getById(authorized.id, (user) => {
            request.currentUser = user;
            next();
        });
    } else {
        // if there is no authorization header

        return response.status(403).json({
            message: 'Invalid token'
        });
    }
};