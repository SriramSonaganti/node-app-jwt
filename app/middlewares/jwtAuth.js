const jwt = require('jsonwebtoken')
const config = require('../config/auth.config.js')
const db = require('../models/index.model')
const User = db.user;
const Role = db.role;

verifyToken = (req,res,next) => {
    let token = req.headers["authtoken"];

    if(!token){
        return res.status(403).send({message:'please provide the token'})
    }
    
    jwt.verify(token, config.secret, (err, decoded) => {
        if(err){
            return res.status(401).send({message:"Unauthorized"});
        }
        req.userId = decoded.id;
        next()
    });
};

isAdmin = (req,res,next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        Role.find(
            {
                _id: {$in:user.roles}
            },
            (err,roles) => {
                if(err){
                    res.status(500).send({message:err})
                    return;
                }

                for(let i =0;i< roles.length;i++){
                    if(roles[i].name == 'admin'){
                        next();
                        return;
                    }
                }
                res.status(403).send({message:"you need admin privilleges"})
                return
            }
        )

    })
}

const jwtAuth = {
    verifyToken,
    isAdmin
}

module.exports = jwtAuth;