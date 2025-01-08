const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.Cloud_name,
    api_key: process.env.cloud_key,
    api_secret: process.env.cloud_pass, 
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust',
      allowedFormats:["png","jpg","jpeg"],
    },
  });

  module.exports={storage,cloudinary};