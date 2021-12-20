const db = require('../models/index.model')
const ROLES = db.ROLES;
const User = db.user;

checkDuplicatieUsernameAndEmail = (req,res,next) => {
    //username checking
    User.findOne({
        username:req.body.username
    }).exec((err,user) => {
        if(err){
            res.status(500).send({message:err})
        }

        if(user){
            res.status(400).send({message:"Ooops !! The Username exists already choose other one"})
            return;
        }

        //Email checking
        User.findOne({
            email:req.body.email
        }).exec((err,user) => {
            if(err){
                res.status(500).send({message:err})
            }
    
            if(user){
                res.status(400).send({message:"Ooops !! The Username exists already choose other one"})
                return;
            }

            next();
        });
    });
};

checkRolesExisted = (req,res,next) => {
    
    if(req.body.roles){
        for (let index = 0; index < req.body.roles.length; index++) {
            
            if(!ROLES.includes(req.body.roles[index])){
                res.status(400).send({message:`Failed!! the role ${req.body.roles[index]} you choose does not exist`});
                return;
            }    
        }
    }
    next()
};

const verifySignup = {
    checkDuplicatieUsernameAndEmail,
    checkRolesExisted
};

module.exports = verifySignup;
