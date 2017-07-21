// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');


//Our UserSchema for each user register.
// set up a mongoose model and pass it using module.exports
const UserSchema= new Schema({
    firstname:{
      type: String,
      required : [true,'first name is required']
    } ,
    lastname:{
      type: String,
      required : [true,'last name is required']
    } ,
    email:{
      type:String,
      required : [true,'email is required']
    },
    password:{
      type: String,
      required : [true,'password is required']
    },
    ques:[String],
    ans:[String],
    date:{
     type: Date,
     default: Date.now
   }
});

const User= mongoose.model('user', UserSchema);

module.exports = User;

//for creating user (also To hash a password)
module.exports.createUser = function(newUser,callback){
  bcrypt.genSalt(10,function(err,salt){
    bcrypt.hash(newUser.password,salt,function(err,hash){
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

//To check a password:
module.exports.comparePassword = function(candidatePassword,hash,callback){
  bcrypt.compare(candidatePassword,hash,function(err,isMatch){
    if(err) throw err;
    callback(null,isMatch);
  });
}
