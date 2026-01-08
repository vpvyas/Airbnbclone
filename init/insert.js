let mongoose=require("mongoose");
let initaldata=require("./data.js");
let homeschema=require("../models/homeschema.js")
main().then(()=>{
    console.log("Connection eststablished");
    
}).catch((err)=>{
    console.log("not connected");
})
async function main(){
   await mongoose.connect('mongodb://127.0.0.1:27017/homeCorner');
}
async function insertDb(){
        await homeschema.deleteMany({});
        await homeschema.insertMany(initaldata.data);
        console.log("inserted successfully")
}
insertDb();