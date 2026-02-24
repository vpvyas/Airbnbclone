const express=require("express");
const router=express.Router();
const Listscollection = require("../models/homeschema");
const Review = require("../models/reviews.js");
let wrapAsync=require("../utils/script.js");
let ExpressError=require("../utils/ExpressError.js")
const {isLoggedIn}=require("../middleware.js");

router.get("/", wrapAsync(async (req, res) => {
    let datas = await Listscollection.find({});
    res.render("listingsee.ejs",{datas});
}));
/*search house according  */
router.get("/loc", wrapAsync(async (req, res,next) => {
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
router.get("/newpost",isLoggedIn,(req,res)=>{
     res.render("newpost.ejs")
})
router.post("/new",wrapAsync(async(req,res,next)=>{
      let listing=req.body.listing;
      const newList=new Listscollection(listing);
      if(!newList){
        next(new ExpressError(404,'some field is missing .'))
      }
      await newList.save();
      req.flash("success","New listing created successfully");
      res.redirect("/listing")
}));
/*detailed panel */
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let datas = await Listscollection.findById(id).populate("Reviews");
    console.log(datas)
    res.render("detail.ejs",{datas});
}))
//delete
router.delete("/:id/del",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let del=await Listscollection.findByIdAndDelete(id);
    console.log(del);
    req.flash("success","Deleted sucessfully");
    res.redirect("/listing");
}))
/*edit the data */
router.patch("/:id/edit",isLoggedIn,wrapAsync(async(req,res)=>{
     let {id}=req.params;
     let listing=req.body.listing;
     let datas=await Listscollection.findByIdAndUpdate(id,listing);
     console.log(datas);
     req.flash("success","update  sucessfully");
     res.redirect("/listing");
}))
router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res)=>{
     let {id}=req.params;
     let datas = await Listscollection.findById(id);
     res.render("edit.ejs",{datas});
}))
/*Reviw  */
router.post("/:id/reviews",isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;

    let listing = await Listscollection.findById(id);

    let newReview = new Review(req.body.review);

    await newReview.save();

    listing.Reviews.push(newReview._id);

    await listing.save();

    req.flash("success","Review Added Successfully");

    res.redirect(`/listing/${id}`);
}));
router.delete("/:id/reviews/:revireviewId",isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id,revireviewId } = req.params;
    console.log(id,revireviewId);
    /*delete reviewid from list */
   await Listscollection.findByIdAndUpdate(id, { $pull: { Reviews: revireviewId } });
    await Review.findByIdAndDelete(revireviewId);
    req.flash("success","Review Deleted Successfully");
    res.redirect(`/listing/${id}`);

}))
module.exports=router;