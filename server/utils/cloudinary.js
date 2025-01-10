const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

//configure with env data
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

async function uploadMediaToCloudinary(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder: "fullstack_instagram_clone",
      transformation: [
        {
          width: 500,
          height: 500,
          crop: "limit",
          format: "webp",
        },
      ],
    });

    return result;
  } catch (error) {
    throw new Error("Error uploading to Cloudinary: " + error.message);
  }
}
const deleteMediaFromCloudinary = async (imageUrl) => {
  try {
    await cloudinary.uploader.destroy(imageUrl);
  } catch (error) {
    console.log(error);
    throw new Error("failed to delete assest from cloudinary");
  }
};

module.exports = { uploadMediaToCloudinary, deleteMediaFromCloudinary };
