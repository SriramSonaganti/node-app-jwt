const {jwtAuth} = require('../middlewares/middleware')
const controller = require('../controllers/user.controller');

module.exports = function(app) {
    app.use(function(req,res,next){
        res.header(
            "Access-Control-Allow-Headers",
            "authtoken, Origin, Content-Type, Accept"
          );
          next();
    })

    app.get("/api/all",controller.publicRoute);

    app.get(
        "/api/admin",
        [jwtAuth.verifyToken, jwtAuth.isAdmin],
        controller.adminBoard
      );

      app.get(
        "/api/admin/users",
        [jwtAuth.verifyToken, jwtAuth.isAdmin],
        controller.fetchAllUsers
      );
}