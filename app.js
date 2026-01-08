let mongoose=require("mongoose");
let express=require("express");
let path=require("path");
let ExpressError=require("./utils/ExpressError.js")
let wrapAsync=require("./utils/script.js");
const methodOverride = require('method-override');
const Listscollection = require("./models/homeschema");
const ejsMate=require("ejs-mate");
let app=express();
app.listen(8080,(req,res)=>{
    console.log("server initated ");
})

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
app.get("/listing",async(req,res)=>{
    //res.send("hhii this is listed of homes");
    let datas=await Listscollection.find({});
    res.render("listingsee.ejs",{datas})
})
/*search house according  */
app.get("/listing/loc", wrapAsync(async (req, res,next) => {
  const { loc } = req.query;
  const datas = await Listscollection.find({ location: loc });
  console.log(datas);
  if(datas.length==0){
    next(new ExpressError(404,'location not found'));
  }else{
    res.render("listingsee.ejs",{datas});
  } 
}))
/*new post create */
app.get("/listing/newpost",(req,res)=>{
     res.render("newpost.ejs")
})
app.post("/listing/new",wrapAsync(async(req,res,next)=>{
// let{title,description,image,price,location,country}=req.body.listing;
// //console.log(title,description,image,price,location,country);
      let listing=req.body.listing;
      const newList=new Listscollection(listing);
      if(!newList){
        next(new ExpressError(404,'some field is missing .'))
      }
      await newList.save();
      res.redirect("/listing")
}));
/*detailed panel */
app.get("/listing/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let datas=await Listscollection.find({_id:id});
    res.render("detail.ejs",{datas});
}))
//delete
app.delete("/listing/:id/del",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let del=await Listscollection.findByIdAndDelete(id);
    console.log(del);
    res.redirect("/listing");
}))
/*edit the data */
app.patch("/listing/:id/edit",wrapAsync(async(req,res)=>{
     let {id}=req.params;
     let listing=req.body.listing;
     let datas=await Listscollection.findByIdAndUpdate(id,listing);
     console.log(datas);
     res.redirect("/listing");
}))
app.get("/listing/:id/edit",wrapAsync(async(req,res)=>{
     let {id}=req.params;
     let datas=await Listscollection.find({_id:id});
     res.render("edit.ejs",{datas});
}))
app.use((err,req,res,next)=>{
    let {status=500,message='something went wrong'}=err;
    res.render("err.ejs",{message});
})