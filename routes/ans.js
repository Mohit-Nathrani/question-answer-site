// getting an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Our AnsSchema for each answer given by a user.
// settng up a mongoose model and pass it using module.exports
var AnsSchema = new Schema({
  userid: String,
  ans: String,
  date :{
   type: Date,
   default: Date.now
 },
  views : [String],
  up : [String],
  down : [String],
  quesid:String
});

const Ans= mongoose.model('ans', AnsSchema);

module.exports = Ans;

module.exports.createAns = function(newAns,callback){
  newAns.save(callback);
}
