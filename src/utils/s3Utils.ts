import AWS from 'aws-sdk';
import { Readable } from 'stream';
import path from 'path';
import mime from 'mime-types'; // Used to dynamically detect content types

// Initialize S3 client
const s3 = new AWS.S3();
export const uploadImageToS3 = (
  fileStream: Readable, // Accept a Readable stream
  bucketName: string,
  key: string,
  originalFileName: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Determine file extension and content type dynamically
    const fileExtension = path.extname(originalFileName).toLowerCase();
    const contentType = mime.lookup(fileExtension) || 'application/octet-stream'; // Default to binary if mime type is unknown

    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: fileStream, // Use the stream as the body of the upload
      ContentType: contentType, // Dynamically set the content type
    };

    s3.upload(uploadParams, (err: any, data: any) => {
      if (err) {
        console.error('Error uploading image to S3:', err);
        reject(err);
      } else {
        resolve(data.Location); // Return the S3 URL
      }
    });
  });
};