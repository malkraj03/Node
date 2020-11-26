var mongoose = require('mongoose')
var jwt = require('jsonwebtoken')

var schema = mongoose.Schema
var studentSchema = new schema({
name:{type:String},
email:{type:String},
password:{type:String},
profile:{ type:String }
})
module.exports = mongoose.model('action3',studentSchema);