
const express = require('express');
const router = express.Router();
const User = require('../modles/user');
const config = require('../config/database');
var nodemailer = require('nodemailer'); 
const jwt=require("jsonwebtoken");
const passport = require('passport');



router.post("/register",function (req,res){
    
    const newUser = new User({

        username:req.body.username,
        name:req.body.name,
        empType:req.body.empType,
        email:req.body.email,
        password:req.body.password
    });
   
    console.log(newUser);
    User.saveUser(newUser,function (err,user) {
        if(err){
            res.json({state:false,msg:"data not inserted"});
        }
        if(user){
            res.json({state:true,msg:"data  inserted"});

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'piyasenaran@gmail.com',
                  pass: 'hemmathagama'
                }
              });
              var mailOptions = {
                from: 'piyasenaran@gmail.com',
                to: user.email,
                subject: 'Thanks for joining with Pheonix ',
                text: 'Congratulations you are registerd pheonix project management tool '
              };
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              }); 
        }

    });
});


router.post("/login",function (req,res){

    const email = req.body.email;
const password = req.body.password;

User.findByEmail(email,function (err,user) {
    if(err) throw err;

    if (!user){
        res.json({state:false,msg:"No user found"});
        return false;
}

User.passwordCheck(password,user.password,function (err,match) {
    if (err) throw err;

if(match){
res.json({state:true,msg:"user found"});
   
    }
});

  
   // console.log("email password combination worked");
   // res.json({state:true,msg:"email password combination worked"});
}

if(!match){
    console.log("email password combination not worked");
    res.json({state:false,msg:"email password combination not worked"});
}

});


});

});


router.post('/profile', passport.authenticate('jwt', { session: false }),function(req, res) {
        res.json({user:req.user.email});
        console.log(req.user.email);
    }
);

module.exports = router;
