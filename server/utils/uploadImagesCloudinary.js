import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLODINARY_CLOUD_NAME,
  api_key: process.env.CLODINARY_API_KEY,
  api_secret: process.env.CLODINARY_API_SCECRET_KEY,
});

const uploadImageCloudinary = async (image) => {
  const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());

  const uploadImage = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "Ecom" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    // ✅ send buffer into stream
    stream.end(buffer);
  });

  return uploadImage;
};

export default uploadImageCloudinary;
