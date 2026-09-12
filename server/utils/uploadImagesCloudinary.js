import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const uploadImageCloudinary = async (image) => {
  console.log("Cloudinary Config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
})
  console.log("...................Uploading image to cloudinary..........  1 ...........")
  const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());
   console.log("...................Uploading image to cloudinary..........  2 ...........")
  const uploadImage = await new Promise((resolve, reject) => {
     console.log("...................Uploading image to cloudinary..........  3 ...........")
    const stream = cloudinary.uploader.upload_stream(
      { folder: "Ecom" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
       console.log("...................Uploading image to cloudinary..........  4 ...........")
    );  
     console.log("...................Uploading image to cloudinary..........  5 ...........")

    // ✅ send buffer into stream
    stream.end(buffer);
     console.log("...................Uploading image to cloudinary..........  6 ...........")
  });
 console.log("...................Uploading image to cloudinary..........  7 ...........")
  return uploadImage;
   console.log("...................Uploading image to cloudinary..........  8...........")
};

export default uploadImageCloudinary;
