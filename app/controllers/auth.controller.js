const config = require('../config/auth.config')
const db = require('../models/index.model')
const User = db.user;
const Role = db.role;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

exports.signup = (req,res) => {
    const user = new User({
        username: req.body.username,
        email:req.body.email,
        password:bcrypt.hashSync(req.body.password)
    });

    user.save((err,user) =>{
        if(err){
            res.status(500).send({message:err})
            return;
        }

        if(req.body.roles){
            Role.find({
                name:{$in: req.body.roles}
            },
            (err,roles) => {
                if(err){
                    res.status(500).send({message:err})
                    return
                }
                user.roles = roles.map(role => role._id)
                user.save(err => {
                    if(err){
                        res.status(500).send({message:err});
                        return;
                    }
                    res.send({message:"You have registered sucessfully"})
                });
            });
        }
        else{
            Role.findOne({name:'user'},(err,role)=>{
                if(err){
                    res.statu(500).send({
                        message:err
                    })
                }
                res.send({message:"Registererd as user"})
            });
        }
    })
}

exports.signin = (req,res) => {
    User.findOne({
        username:req.body.username
    })
    .populate("roles",'-__v')
    .exec((err,user)=>{
        if(err){
            res.status(500).send({message:err})
            return
        }

        if(!user){
           return res.status(404).send({message:"User Not Found"})
        }

        var passwordIsValid = bcrypt.compareSync(req.body.password,user.password);

        if(!passwordIsValid){
            return res.status(401).send({
                authToken: null,
                message: "Invalid Password!"
            });
        }

        var token  = jwt.sign({id:user.id},config.secret,{expiresIn:86400});

        var authorities =[];

        for(let i =0;i< user.roles.length;i++){
            authorities.push("ROlE_"+user.roles[i].name.toUpperCase());
        }

        res.status(200).send({
            id:user.id,
            username:user.username,
            email:user.email,
            roles:authorities,
            authToken:token,
        })
    })
}