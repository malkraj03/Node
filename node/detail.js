var mongoose = require('mongoose')

var schema = mongoose.Schema
var studentSchema = new schema({
name:{type:String},
email:{type:String},
password:{type:String},
confirm_password:{type:String}
})

module.exports = mongoose.model('Details',studentSchema)

