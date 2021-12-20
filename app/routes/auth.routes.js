const {verifySignup} = require('../middlewares/middleware')
const controller = require('../controllers/auth.controller');

module.exports = function(app){
    app.use(function(req,res,next) {
        res.header(
            "Access-Control-Allow-Headers",
            "authtoken, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/signup",
        [
            verifySignup.checkDuplicatieUsernameAndEmail,
            verifySignup.checkRolesExisted,
        ],
        controller.signup
    );

    
    app.post("/api/signin",controller.signin);
}