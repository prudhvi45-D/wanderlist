const { string, date } = require("joi");
const mongoose = require("mongoose");
const { required, type, schema } = require("../schema");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment:
    {
        type:String,
    },
    rating:
    {
        type:Number,
    },
    created_at:
    {
        type:Date,
        default:Date.now,
    },
    author:{
           type:Schema.Types.ObjectId,
            ref:"User"
    },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;

