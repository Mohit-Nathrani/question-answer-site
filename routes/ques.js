// getting an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Our QuesSchema for each question asked by a user.
// set up a mongoose model and pass it using module.exports
const QuesSchema= new Schema({
    userid:{
      type: String,
      required : [true,'user who is asking the question is required']
    } ,
    question:{
      type:String,
      required : [true,'question is required']
    } ,
    date :{
     type: Date,
     default: Date.now
   },
    ansid: [String]
});

const Ques= mongoose.model('ques', QuesSchema);

module.exports = Ques;

module.exports.createQues = function(newQues,callback){
  newQues.save(callback);
}
