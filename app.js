let mongoose=require("mongoose");
let express=require("express");
let path=require("path");
const methodOverride = require('method-override');
const listRouter=require("./routes/listings.js");
const ejsMate=require("ejs-mate");
let app=express();
const User=require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const userRoute=require("./routes/userRoute.js");
const session=require("express-session")
const flash=require("connect-flash");
const sessionOption={
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge:7*24*3600*1000,
        expires:7*24*3600*1000,
        httpOnly:true
    }
}
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // middleware
app.use(express.static(path.join(__dirname,"/public")));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/homeCorner")
}
main().then(()=>{
    console.log("connection established..");
}).catch((err)=>{
    console.log(err);
})

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user; 
    next();
});
app.use("/",userRoute);
app.use("/listing", listRouter);   // routes after flash
/*Reviews List */
// app.post("/listing/:id/review",async(req,res)=>{
//     let {id}=req.params;
//     let listing=await Listscollection.findById(id);
//     let newReview=new Reviews(listing.Reviews);
//     console.log(newReview)
// })

app.use((err,req,res,next)=>{
    console.log("FULL ERROR:", err);   // 👈 ADD THIS
    let {status=500,message='something went wrong'}=err;
    res.status(status).render("err.ejs",{message});
});
app.listen(8080,(req,res)=>{
    console.log("server initated ");
})
