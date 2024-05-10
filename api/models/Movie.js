const { required } = require("joi");
const mongoose = require("mongoose");
const { type } = require("os");

const MovieSchema = new mongoose.Schema(
  {
    id:{type:Number },
    title: { type: String, required: true, unique: true },
    title_eng:{type:String,required:true,unique:true},
    desc: { type: String },
    img: { type: String },
    imgTitle: { type: String },
    imgSm: { type: String },
    trailer: { type: String },
    video: { type: String },
    release_date: { type: String },
    limit: { type: Number },
    genre: { type: String },
    isSeries: { type: Boolean, default: false },
    rating :{type:String},
    duration :{type:String},
    director :{type:String},
    actors :{type:Array},
    language :{type:String},
    country :{type:String},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", MovieSchema);
