import AWS from "aws-sdk";
import { Readable } from "stream";
import { Upload } from "@aws-sdk/lib-storage";
import { Stall } from "../models/stall"; // Assuming you have a Stall model
import mime from "mime-types"; // To dynamically set the content type
import path from "path";
import dotenv from "dotenv";

import {
  S3Client,
} from "@aws-sdk/client-s3";
dotenv.config();
// Initialize the AWS S3 client
// const s3 = new AWS.S3();
const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION ,
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
      wall4Url: stall.wall4Url
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
      wall4Url: stall.wall4Url
    };
  } catch (error) {
    console.error("Error during image update:", error);
    throw new Error("Failed to update images");
  }
};
