const User=require("../models/user.js");
const express=require("express");
const router=express.Router();
const passport = require("passport");
router.get("/register",(req,res)=>{
     res.render("./user/register.ejs");
    // res.send("register page");
})
router.post("/register",async(req,res)=>{
    let {username,email,password}=req.body;
    try{
        console.log(username,email,password);
        const user=new User({username,email});
        const registered=await User.register(user,password);
        console.log(registered);
       
        req.login(registered,(err)=>{
            if(err){
               return next(err);
            }
            req.flash("success","Welcome to HomeCorner");
            res.redirect("/listing");
        })  
    } catch(err){
        req.flash("error",err.message);
        res.redirect("/register");
    }

});
router.get("/login",(req,res)=>{
    res.render("./user/login.ejs");
})
router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' ,failureFlash: "Please enter valid username and password"  }),
  async function(req, res) {
    req.flash("success","Logged in successfully");  
    res.redirect('/listing');
  });
  router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            console.log(err);
        }
        req.flash("success","Logged out successfully");
        res.redirect("/listing");
    })
  });
module.exports=router;