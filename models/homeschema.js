let mongoose=require("mongoose");
let Review=require("./reviews.js");
let homeschema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        filename:String, 
        url:String,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String
    },
   Reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }
  ]
   
});
/*see there are two type of middle ware pre and post middleware */
homeschema.post("findOneAndDelete", async (listing) => {
    
    console.log(listing.Reviews);
    if (listing) {
        await Review.deleteMany({
            _id: { $in: listing.Reviews }
        });
    }
});
let Listscollection=mongoose.model("Listscollection",homeschema);
module.exports=Listscollection;