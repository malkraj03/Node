var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var jwt = require('jsonwebtoken')
var studentDetails = require('./detail')
var cookieparser = require('cookie-parser')
var jwtVerifier = require('express-jwt') 
var cors = require('cors')

function generateAccessToken(name,password) {
    return jwt.sign({name,password}, "secret");
  }



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

app.use(cookieparser());

app.get('/:id', async(req, res) =>{
    var id = req.params.id
    var details = await studentDetails.findById(id)   
    res.json(details)     
    })

function authenticateToken(req, res, next) {
        // Gather the jwt access token from the request header
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401) // if there isn't any token
      
        jwt.verify(token, "secret", (err, user) => {
          console.log(err)
          if (err) return res.send("Access denied....")
          req.user = user
          next() // pass the execution off to whatever request the client intended
        })
      }


app.post('/about', authenticateToken, (req, res) => {
        res.send("Access granted....")
      })


app.post("/login",function(req,res) {
var name = req.body.name 
var password = req.body.password
var valid;
studentDetails.findOne({$or: [{name:name}]})
.then(user =>{
    if(user){
        if(password == user.password){
            valid = "successfully login"
            var token = generateAccessToken({ name, password});
            res.send(token)
        }
        else{
            valid = "invalid password"
            res.send(valid)
        }
            }
    else{
        res.send("No user found")
    }
})
})


app.post("/formsubmit",async(req,res) =>{
var studentRequest = new studentDetails({
name: req.body.name,
email: req.body.email,
password: req.body.password,
profile : req.body.profile
})
try{
    var name = await studentDetails.findOne({name: req.body.name})
    var email = await studentDetails.findOne({email: req.body.email})
    var status,code,msg,img;
    var valid_ext = ["jpeg","jpg","png",'jfif']
    var img_ext = req.body.profile.substring(req.body.profile.lastIndexOf(".")+1)
    var final = valid_ext.includes(img_ext)
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
    else if(final === false){
        status = 'error'
        code = 404
        msg = "Uploaded file is not an image"
    }
    
    else{
        var data = await studentRequest.save()
        status ='sucess'
        code = 200
        msg="Name,email,profile are saved "
    }
    var result = {
        status : status,
        code : code,
        message : msg
    }
    res.json(result)
}catch(err){
    res.send(err)
}
})



app.listen(3800,(err) =>{
if(err){
console.log(err)
}else{
console.log('Server is running now......')
    }
})
