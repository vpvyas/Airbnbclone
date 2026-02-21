let mongoose=require("mongoose");
let homeschema=new mongoose.Schema({
    message: {
        type:String
    },
    rating:{
        type:Number,
    },
    createdAt: {
        type:Date,
        default:Date.now()
    }

})

module.exports=mongoose.model("Review",homeschema);