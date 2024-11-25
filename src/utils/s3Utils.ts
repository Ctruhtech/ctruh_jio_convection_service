import AWS from 'aws-sdk';
import { Readable } from 'stream';

// Initialize S3 client
const s3 = new AWS.S3();

export const uploadImageToS3 = (
  fileStream: Readable, // Accept a Readable stream
  bucketName: string,
  key: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: fileStream, // Use the stream as the body of the upload
      ContentType: 'image/jpeg', // You can dynamically set the ContentType if needed
    };

    s3.upload(uploadParams, (err:any, data:any) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location); // Return the S3 URL
      }
    });
  });
};
