const mongoose = require('mongoose');   //import mongoose after installtion >npm install --save  mongoose
const uniqueValidator = require('mongoose-unique-validator');
const userSchema = mongoose.Schema({      //make schema for database
    email: {type: String, required: true, unique: true},  //node js captal s for data type 
    password: {type: String, required: true}
});
userSchema.plugin(uniqueValidator);
module.exports =  mongoose.model('User', userSchema);//export module & collection name is posts