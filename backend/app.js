const path = require("path");
const express = require('express');         //import express

const app = express();                       //execute as a function and return express app

const mongoose = require('mongoose');
const postsRouters = require('./routes/posts');
const userRouters = require('./routes/users');
// mongoose.connect("mongodb://0.0.0.0:27017/node-angularDB",{useNewUrlParser: true, useUnifiedTopology: true}, (err)=>{
// if(!err) console.log('db connected');
// else console.log('db error');
// });
const DB ="mongodb+srv://pratiksha:"+ process.env.MONGO_ATLAS_PW +"@cluster0.vta65pm.mongodb.net/node-angularDB?retryWrites=true&w=majority";
mongoose.connect(DB,{useNewUrlParser: true, useUnifiedTopology: true}, (err)=>{
if(!err) console.log('db connected');
else console.log(err);
});



const bodyParser = require('body-parser');
const e = require('express');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("images")));//allow access for image folder
// app.use((req, res, next)=>{                 //take three parameter request, response and next -it is middleware -use is keyword
//     console.log('First middleware');
//     next();
// });

//to add headers -client and server port is diffrent (cors-cross origin resource sharing) to resolve this below code
app.use((req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    // res.setHeader("Access-Control-Allow-Headers", 
    // "Origin, x-Requested-With, Content-Type, Accept, Authorization"
    // );
    res.setHeader(  
        "Access-Control-Allow-Headers",  
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");  
    res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS") ;

    next();
});
//body parser need to install command npm install --save -body-parser
//then below code is running
app.use("/api/posts",postsRouters);
app.use("/api/user",userRouters);
module.exports = app;  //export app using module