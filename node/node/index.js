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


app.get('/getdetails',async(req,res) =>{
    try{
        var details = await studentDetails.find() 
        res.json(details)
    }
    catch(err){
        res.send("Error ",err)
    }
}) 

app.post('/checkingnamemail',async(req,res)=>{
    try{
        var name = await studentDetails.findOne({name: req.body.name})
        var email = await studentDetails.findOne({email: req.body.email})
        if(name!== null){
            res.send("Name is exist")
        }
        else if(email!== null){
            res.send("Email is exist")
        }
        else{
            res.send("Name and Email not exist")
        }
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




app.post("/formsubmit",async(req,res) =>{
var studentRequest = new studentDetails({
name: req.body.name,
email: req.body.email,
password: req.body.password
})
try{
    var name = await studentDetails.findOne({name: req.body.name})
    var email = await studentDetails.findOne({email: req.body.email})
    var status,code,msg;
    if(name!== null){
        status ='error'
        code = 404
        msg="Name is exist"
    }
    else if(email!== null){
        status ='error'
        code = 404
        msg ="Email is exist"
    }
    else{
        var data = await studentRequest.save()
        status ='sucess'
        code = 200
        msg="Name and email not exist"
    }
    var result = {
        status : status,
        code : code,
        message : msg
    }
    res.json(result)
}catch(err){
    res.send("Error ",err)
}
})
app.listen(3800,(err) =>{
if(err){
console.log(err)
}else{
console.log('Server is running now......')
    }
})
