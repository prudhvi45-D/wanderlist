const { ref } = require("joi");
const mongoose = require("mongoose");
const Review = require("./review");
const { type } = require("../schema");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
      url:String,
      filename:String,
    },
    price: Number,
    location: String,
    country: String,
    review:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry: {
        type: {
          type: String, 
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
});
listingSchema.post("findOneAndDelete", async(listing)=>
{
    if(listing)
    {
        await Review.deleteMany({_id:{$in:listing.review}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
