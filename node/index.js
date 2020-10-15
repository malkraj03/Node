var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var studentDetails = require('./detail')
var cors = require('cors')
var app = express()
app.use(express.json())

mongoose.connect('mongodb://localhost/details', {
useNewUrlParser: true,
useUnifiedTopology: true
});
var con = mongoose.Connection

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


app.get('/getmethod',async(req,res) =>{
    try{
        var details = await studentDetails.find() 
        res.json(details)
    }
    catch(err){
        res.send("Error ",err)
    }
})

app.get('/:id', async(req, res) =>{
    var id = req.params.id
    var details = await studentDetails.findById(id)   
    res.json(details)     
    
})


app.post("/postmethod",async(req,res) =>{
var studentRequest = new studentDetails({
name: req.body.name,
email: req.body.email,
password: req.body.password,
confirm_password: req.body.confirm_password
})
try{
    var data = await studentRequest.save()
    res.json(data)
}catch(err){
    res.send("Error ",err)
}
})
app.listen(3600,(err) =>{
if(err){
console.log(err)
}else{
console.log('Server is running now......')
    }
})
