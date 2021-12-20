const db = require("../models/index.model");
const User = db.user 
exports.adminBoard = (req,res) => {
    res.status(200).send("admin content")
}

exports.publicRoute = (req,res) => {
    res.status(200).send("public content")
}

exports.fetchAllUsers = (req,res ) => {
    const username = req.body.username;

    User.find()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "something went wrong .. !!"
            })
        })

}