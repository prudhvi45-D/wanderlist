const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");
const mongo_url ="mongodb://127.0.0.1:27017/wanderlist";
async function main() {
    await mongoose.connect(mongo_url);
    
}
main().then(()=>
{
    console.log("connection successful");
}).catch((err)=>
{
    console.log(err);
})

async function init() {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({
        ...obj,
        owner: "67680d1d05252b3e51cb52cc",
        geometry: {
            type: "Point", 
            coordinates: obj.geometry && obj.geometry.coordinates && obj.geometry.coordinates.length === 2
                ? obj.geometry.coordinates
                : [-73.97, 40.78]
        }
    }));
    
    await Listing.insertMany(initdata.data);
    console.log("saved to db");
};
init();