import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv"

dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // console.log("File uploaded on cloudinary", response.url);

    
    // once file is uploaded, we would like to delete it from the our server(public folder)
    fs.unlinkSync(localFilePath);
    return response;
    
  } catch (error) {
    console.log("Error on cloudinary ", error)
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    console.log("Deleted from cloudinary. Public Id ", publicId)

  } catch (error) {
    console.log("Error deleting from cloudinary", error)
    return null
  }
}

export { uploadOnCloudinary, deleteFromCloudinary };


