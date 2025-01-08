const Joi = require("joi");

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object({
            filename: Joi.string().default("listings").allow(null, ""),
            url: Joi.string().uri().default("https://unsplash.com/photos/a-car-parked-in-front-of-a-tall-building-Yg93zXGvsbQ").allow(null, "")
        }).optional()
    })
    });

    module.exports.reviewSchema=Joi.object({
        review:Joi.object({
            rating:Joi.number().required().min(1).max(5),
            Comment:Joi.string().required()
        }).required()
    });

module.exports = listingSchema;
