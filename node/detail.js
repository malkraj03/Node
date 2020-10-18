var mongoose = require('mongoose')

var schema = mongoose.Schema
var studentSchema = new schema({
name:{type:String},
email:{type:String},
password:{type:String},
})

module.exports = mongoose.model('action1',studentSchema)

