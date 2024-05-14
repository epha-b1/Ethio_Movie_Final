const { required } = require("joi");
const mongoose = require("mongoose");
const { type } = require("os");

const MovieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    title1:{type:String,required:true,unique:true},
    description: { type: String },
    img: { type: String },
    imgTitle: { type: String },
    thumbnail: { type: String },
    trailer: { type: String },
    video: { type: String },
    releaseDate: { type: String },
    limit: { type: Number },
    genre: { type: String },
    isSeries: { type: Boolean, default: false },
    rating :{type:String},
    duration :{type:String},
    director :{type:String},
    actors :{type:Array},
    language :{type:String},
    country :{type:String},
    uploadedBy: {
      type: String, // Assuming phoneNumber is stored as a string
      ref: "User",
      required: true,
    },
    views: { type: Number, default: 0 }, // Number of views

  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", MovieSchema);
