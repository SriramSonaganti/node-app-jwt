const http = require('http');
const express = require('express')
const cors = require('cors')



const app = express();


//setting the cors option on a url
var corsOptions = {
    origin : "http:localhost:3000"
}

//making our app use the cors
app.use(cors(corsOptions));


//parse requests of content-type -- application/json
app.use(express.json());


//parse requests of content-type -application/x-www-form-urlencoded
app.use(express.urlencoded({extended:true}));

const db = require('./app/models/index.model');
const Role = db.role


//Mongodb connection intialization
db.mongoose
    .connect(db.url, {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(() => {
        console.log("Connected to MongoDb");
        initial()
      
    })
    .catch(err => {
        console.log("Connection error ... ")
        process.exit()
    })


//Simple router for testing
app.get('/',(req,res) => {
    res.json({message:"welcome to the node app"});
})

//Linking our other routes in this file so they willl be used when this file runs

require('./app/routes/auth.routes')(app)
require('./app/routes/user.routes')(app)

const PORT = process.env.PORT || 8080;

app.listen(PORT ,() => {
    console.log(`server is running on port ${PORT}`);
})


//Intializing the roles in mongo
function initial() {
    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          name: "user"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'user' to roles collection");
        });
  
        
        new Role({
          name: "admin"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'admin' to roles collection");
        });
      }
    });
}
  


