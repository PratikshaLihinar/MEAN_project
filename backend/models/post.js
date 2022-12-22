const mongoose = require('mongoose');   //import mongoose after installtion >npm install --save  mongoose
const postSchema = mongoose.Schema({      //make schema for database
    title: {type: String, required: true},  //node js captal s for data type 
    content: {type: String, required: true},
    imagePath: {type: String, require: true}
    // creator: {type: mongoose.Schema.Types.ObjectId,ref:"User", required: true}
});

module.exports =  mongoose.model('Post', postSchema);//export module & collection name is posts