import AWS from "aws-sdk";
import { Readable } from "stream";
import { Upload } from "@aws-sdk/lib-storage";
import { Stall } from "../models/stall"; // Assuming you have a Stall model
import mime from "mime-types"; // To dynamically set the content type
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

import { S3Client } from "@aws-sdk/client-s3";
dotenv.config();
// Initialize the AWS S3 client
// const s3 = new AWS.S3();
const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Define the interface for the image streams
interface ImageStreams {
  logoStream: Readable;
  wall1Stream: Readable;
  wall2Stream: Readable;
  wall3Stream: Readable;
  wall4Stream: Readable;
}
interface UploadImageResponse {
  logoUrl: string;
  wall1Url: string;
  wall2Url: string;
  wall3Url: string;
  wall4Url: string;
}

export const uploadStallImagesService = async (
  stallId: string,
  uniqueCode: string,
  logoStream: Readable | null,
  wall1Stream: Readable | null,
  wall2Stream: Readable | null,
  wall3Stream: Readable | null,
  wall4Stream: Readable | null
): Promise<UploadImageResponse> => {
  try {
    // Check if the stall exists and if the uniqueCode matches
    const stall = await Stall.findById(stallId);

    if (!stall) {
      throw new Error("Stall not found");
    }

    if (uniqueCode !== stall.uniqueCode) {
      throw new Error("Stall unique code does not match");
    }

    // Array to store the upload promises
    const uploadPromises: Promise<string>[] = [];

    // Check each stream and upload if not null
    if (logoStream) {
      uploadPromises.push(
        parallelUploadToS3(
          process.env.AWS_BUCKET_NAME,
          `logos/${stallId}-${Date.now()}.jpg`,
          logoStream
        )
      );
    }

    if (wall1Stream) {
      uploadPromises.push(
        parallelUploadToS3(
          process.env.AWS_BUCKET_NAME,
          `walls/${stallId}-wall1-${Date.now()}.jpg`,
          wall1Stream
        )
      );
    }

    if (wall2Stream) {
      uploadPromises.push(
        parallelUploadToS3(
          process.env.AWS_BUCKET_NAME,
          `walls/${stallId}-wall2-${Date.now()}.jpg`,
          wall2Stream
        )
      );
    }

    if (wall3Stream) {
      uploadPromises.push(
        parallelUploadToS3(
          process.env.AWS_BUCKET_NAME,
          `walls/${stallId}-wall3-${Date.now()}.jpg`,
          wall3Stream
        )
      );
    }

    if (wall4Stream) {
      uploadPromises.push(
        parallelUploadToS3(
          process.env.AWS_BUCKET_NAME,
          `walls/${stallId}-wall4-${Date.now()}.jpg`,
          wall4Stream
        )
      );
    }

    // Wait for all uploads to complete in parallel
    const uploadedUrls = await Promise.all(uploadPromises);

    // Update stall object with the URLs
    if (logoStream) {
      stall.logoUrl = uploadedUrls.shift();
    }
    if (wall1Stream) {
      stall.wall1Url = uploadedUrls.shift();
    }
    if (wall2Stream) {
      stall.wall2Url = uploadedUrls.shift();
    }
    if (wall3Stream) {
      stall.wall3Url = uploadedUrls.shift();
    }
    if (wall4Stream) {
      stall.wall4Url = uploadedUrls.shift();
    }

    await stall.save();

    // Return the URLs of the uploaded images
    return {
      logoUrl: stall.logoUrl,
      wall1Url: stall.wall1Url,
      wall2Url: stall.wall2Url,
      wall3Url: stall.wall3Url,
      wall4Url: stall.wall4Url,
    };
  } catch (error) {
    console.error("Error during image upload and stall update:", error);
    throw new Error("Failed to upload images");
  }
};

// Helper function for uploading images to S3 using multipart upload
export async function parallelUploadToS3(
  bucketName: string,
  key: string,
  stream: Readable,
  queueSize = 4,
  partSize = 1024 * 1024 * 5
) {
  try {
    const parallelUploadS3 = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: key,
        Body: stream,
        CacheControl: "max-age=0, no-cache, no-store, must-revalidate", // Set cache control directives
      },

      tags: [], // tags (optional)
      queueSize: queueSize, // concurrency configuration
      partSize: partSize, // size of each part in bytes
      leavePartsOnError: false, // manually handle dropped parts
    });

    const result = await parallelUploadS3.done();

    // Return the S3 object URL upon successful upload
    return result.Location;
  } catch (error) {
    throw error; // Rethrow the error
  }
}
export const updateStallImagesService = async (
  stallId: string,
  uniqueCode: string,
  logoStream: Readable | null,
  wall1Stream: Readable | null,
  wall2Stream: Readable | null,
  wall3Stream: Readable | null,
  wall4Stream: Readable | null
): Promise<UploadImageResponse> => {
  try {
    // Check if the stall exists and if the uniqueCode matches
    const stall = await Stall.findById(stallId);

    if (!stall) {
      throw new Error("Stall not found");
    }

    if (uniqueCode !== stall.uniqueCode) {
      throw new Error("Stall unique code does not match");
    }

    // Array to store the upload promises
    const uploadPromises: Promise<string>[] = [];

    // Check each stream and upload if not null, then update the corresponding image URL
    if (logoStream) {
      uploadPromises.push(
        parallelUploadToS3(
          process.env.AWS_BUCKET_NAME,
          `logos/${stallId}-${Date.now()}.jpg`,
          logoStream
        ).then((url) => {
          stall.logoUrl = url;
          return url; // Return the URL to resolve the promise correctly
        })
      );
    }

    if (wall1Stream) {
      uploadPromises.push(
        parallelUploadToS3(
          process.env.AWS_BUCKET_NAME,
          `walls/${stallId}-wall1-${Date.now()}.jpg`,
          wall1Stream
        ).then((url) => {
          stall.wall1Url = url;
          return url; // Return the URL to resolve the promise correctly
        })
      );
    }

    if (wall2Stream) {
      uploadPromises.push(
        parallelUploadToS3(
          process.env.AWS_BUCKET_NAME,
          `walls/${stallId}-wall2-${Date.now()}.jpg`,
          wall2Stream
        ).then((url) => {
          stall.wall2Url = url;
          return url; // Return the URL to resolve the promise correctly
        })
      );
    }

    if (wall3Stream) {
      uploadPromises.push(
        parallelUploadToS3(
          process.env.AWS_BUCKET_NAME,
          `walls/${stallId}-wall3-${Date.now()}.jpg`,
          wall3Stream
        ).then((url) => {
          stall.wall3Url = url;
          return url; // Return the URL to resolve the promise correctly
        })
      );
    }

    if (wall4Stream) {
      uploadPromises.push(
        parallelUploadToS3(
          process.env.AWS_BUCKET_NAME,
          `walls/${stallId}-wall4-${Date.now()}.jpg`,
          wall4Stream
        ).then((url) => {
          stall.wall4Url = url;
          return url; // Return the URL to resolve the promise correctly
        })
      );
    }

    // Wait for all uploads to complete in parallel
    await Promise.all(uploadPromises);

    // Save the stall object with the new image URLs
    await stall.save();

    // Return the updated image URLs
    return {
      logoUrl: stall.logoUrl,
      wall1Url: stall.wall1Url,
      wall2Url: stall.wall2Url,
      wall3Url: stall.wall3Url,
      wall4Url: stall.wall4Url,
    };
  } catch (error) {
    console.error("Error during image update:", error);
    throw new Error("Failed to update images");
  }
};
export const extractKeyFromUrl = (url: string): string => {
  // Make sure the URL is valid and can be parsed
  const urlObj = new URL(url); // Parse the URL
  const pathParts = urlObj.pathname.split("/"); // Split the pathname
  // Skip the first empty element (due to leading '/') and return the rest as the S3 key
  return pathParts.slice(1).join("/");
};
export const deleteStallImageService = async (
  stallId: string,
  uniqueCode: string,
  imageType: "logo" | "wall1" | "wall2" | "wall3" | "wall4"
): Promise<void> => {
  try {
    // Fetch the stall from the database
    const stall = await Stall.findById(stallId);

    if (!stall) {
      throw new Error("Stall not found");
    }

    if (uniqueCode !== stall.uniqueCode) {
      throw new Error("Stall unique code does not match");
    }

    // Get the S3 key (file path) based on image type
    let s3Key: string | undefined;
    switch (imageType) {
      case "logo":
        s3Key = await extractKeyFromUrl(stall.logoUrl);
        break;
      case "wall1":
        s3Key = await extractKeyFromUrl(stall.wall1Url);
        break;
      case "wall2":
        s3Key = await extractKeyFromUrl(stall.wall2Url);
        break;
      case "wall3":
        s3Key = await extractKeyFromUrl(stall.wall3Url);
        break;
      case "wall4":
        s3Key = await extractKeyFromUrl(stall.wall4Url);
        break;
      default:
        throw new Error("Invalid image type");
    }

    if (!s3Key) {
      throw new Error(`No URL found for ${imageType}`);
    }
   
    // Delete the image from S3
    await deleteImageFromS3(s3Key);

    // Remove the URL from the stall document in the database
    switch (imageType) {
      case "logo":
        stall.logoUrl = null;
        break;
      case "wall1":
        stall.wall1Url = null;
        break;
      case "wall2":
        stall.wall2Url = null;
        break;
      case "wall3":
        stall.wall3Url = null;
        break;
      case "wall4":
        stall.wall4Url = null;
        break;
    }

    // Save the updated stall document
    await stall.save();
  } catch (error) {
    console.error(`Error deleting ${imageType} from stall:`, error);
    throw new Error(`Failed to delete ${imageType}`);
  }
};

// Helper function to delete image from S3
const deleteImageFromS3 = async (s3Key: string): Promise<void> => {
  try {
    // Create a delete command
    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME, // Your bucket name
      Key: s3Key, // The S3 key for the image
    };

    // Send the delete request to S3
    const deleteCommand = new DeleteObjectCommand(deleteParams);
    await s3Client.send(deleteCommand);
    console.log(`Successfully deleted image from S3: ${s3Key}`);
  } catch (error) {
    console.error(`Error deleting image from S3:`, error);
    throw new Error("Failed to delete image from S3");
  }
};
