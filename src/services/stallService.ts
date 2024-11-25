import { Stall } from '../models/stall';
import { uploadImageToS3 } from '../utils/s3Utils';
import { Readable } from 'stream';

interface ImageBuffers {
  logoBuffer: Buffer;
  wall1Buffer: Buffer;
  wall2Buffer: Buffer;
  wall3Buffer: Buffer;
}

interface UploadImageResponse {
  logoUrl: string;
  wall1Url: string;
  wall2Url: string;
  wall3Url: string;
  wall4Url: string;
}



interface ImageStreams {
  logoStream: Readable;
  wall1Stream: Readable;
  wall2Stream: Readable;
  wall3Stream: Readable;
  wall4Stream: Readable; // Added wall4Stream
}

export const selectStallAndUploadImages = async (
  stallId: string,
  userId: string,
  zone:string,
  streams: ImageStreams
): Promise<UploadImageResponse> => {
  const stall = await Stall.findById(stallId);

  if (!stall) {
    throw new Error('Stall not found');
  }

  // Upload the images directly from streams to AWS S3
  const logoUrl = await uploadImageToS3(streams.logoStream, process.env.AWS_BUCKET_NAME!, `logos/${userId}-${Date.now()}.jpg`);
  const wall1Url = await uploadImageToS3(streams.wall1Stream, process.env.AWS_BUCKET_NAME!, `walls/${userId}-wall1-${Date.now()}.jpg`);
  const wall2Url = await uploadImageToS3(streams.wall2Stream, process.env.AWS_BUCKET_NAME!, `walls/${userId}-wall2-${Date.now()}.jpg`);
  const wall3Url = await uploadImageToS3(streams.wall3Stream, process.env.AWS_BUCKET_NAME!, `walls/${userId}-wall3-${Date.now()}.jpg`);
  const wall4Url = await uploadImageToS3(streams.wall4Stream, process.env.AWS_BUCKET_NAME!, `walls/${userId}-wall4-${Date.now()}.jpg`); // Wall4 upload

  // Save the URLs in the stall
  stall.logoUrl = logoUrl;
  stall.wall1Url = wall1Url;
  stall.wall2Url = wall2Url;
  stall.wall3Url = wall3Url;
  stall.wall4Url = wall4Url;
  stall.zone =zone ; // Save wall4 URL
  await stall.save();

  return { logoUrl, wall1Url, wall2Url, wall3Url, wall4Url }; // Return wall4 URL
};
