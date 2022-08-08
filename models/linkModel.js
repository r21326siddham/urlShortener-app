const mongoose=require('mongoose');
const linkSchema=mongoose.Schema({
    code:String,
    link:String
})

const Link=mongoose.model("Link",linkSchema);

module.exports=Link;