let mongoose=require("mongoose");
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
    }
});
let Listscollection=mongoose.model("Listscollection",homeschema);
module.exports=Listscollection;