// "use server";

// import { v2 as cloudinary } from "cloudinary";

// const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET!;
// const CLOUDINARY_APIKEY = process.env.CLOUDINARY_APIKEY!;
// const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
// const CLOUDINARY_PRESET = process.env.CLOUDINARY_PRESET!;

// cloudinary.config({
//   cloud_name: CLOUDINARY_CLOUD_NAME,
//   api_key: CLOUDINARY_APIKEY,
//   api_secret: CLOUDINARY_SECRET,
//   upload_preset: CLOUDINARY_PRESET,
// });

// export async function uploadImages(images: File[] | null) {
//   if (!images || images.length === 0) {
//     return { success: false, message: "No images provided" };
//   }

//   try {
//     const uploadPromises = images.map(async (file) => {
//       const bytes = await file.arrayBuffer();
//       const buffer = Buffer.from(bytes);

//       const fileStr = buffer.toString("base64");
//       const fileUri = `data:${file.type};base64,${fileStr}`;

//       return cloudinary.uploader.upload(fileUri, {
//         folder: "PixTrends",
//         resource_type: "auto",
//       });
//     });

//     const results = await Promise.all(uploadPromises);

//     return {
//       success: true,
//       urls: results.map((result) => result.secure_url),
//     };
//   } catch (error) {
//     console.error("Error uploading to Cloudinary:", error);
//     return {
//       success: false,
//       message: error instanceof Error ? error.message : "Error sending photos",
//     };
//   }
// }

"use server";

import axios from "axios";

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
const CLOUDINARY_APIKEY = process.env.CLOUDINARY_APIKEY!;
const CLOUDINARY_PRESET = process.env.CLOUDINARY_PRESET!;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_APIKEY || !CLOUDINARY_PRESET) {
  throw new Error("Cloudinary environment variables are not set");
}

export async function uploadImages(images: File[] | null) {
  if (!images || images.length === 0) {
    return { success: false, message: "No images provided" };
  }

  const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];

  const isAllowedTypes = images.every((image) =>
    allowedImageTypes.includes(image.type),
  );

  if (!isAllowedTypes) {
    return {
      success: false,
      message: `Invalid file type for. Only JPEG, PNG, and GIF are allowed.`,
    };
  }

  try {
    const uploadPromises = images.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_PRESET);
      formData.append("api_key", CLOUDINARY_APIKEY);
      formData.append("folder", "PixTrends");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,

        formData,
      );

      const result = await response.data;
      return result.secure_url;
    });

    const urls = await Promise.all(uploadPromises);

    return {
      success: true,
      urls,
    };
  } catch (error: any) {
    console.error("[CLOUDINARY_UPLOAD_ERROR]:", error.message);
    return {
      success: false,
      message: "Error uploading images",
    };
  }
}
