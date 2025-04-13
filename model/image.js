const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publickId:{
    type:String,
    required:true
  },
  uploadedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user',
    required:true
  }
},{timestamps:true});

module.exports = mongoose.model('Image',imageSchema)
