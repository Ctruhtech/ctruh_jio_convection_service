import { Request, Response } from 'express';
import { Stall } from '../models/stall';
import { Readable } from 'stream';
import { selectStallAndUploadImages } from '../services/stallService';
import multer from 'multer';
import { getFileExtension } from '../utils/fileUtils';

const upload = multer(); // To handle image buffers

// Define the expected structure of req.files
interface Files {
  logo?: Express.Multer.File[];
  wall1?: Express.Multer.File[];
  wall2?: Express.Multer.File[];
  wall3?: Express.Multer.File[];
  wall4?: Express.Multer.File[];
}

// Create a new stall (with default isAvailable: true)
export const createStall = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Stall name is required' });
    }

    // Create a new stall with 'isAvailable' set to true by default
    const newStall = new Stall({
      name,
      isAvailable: true,
    });

    await newStall.save();

    res.status(201).json({ message: 'Stall created successfully', stall: newStall });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all available stalls
export const getAvailableStalls = async (req: Request, res: Response) => {
  try {
    // Fetch all stalls that are available
    const availableStalls = await Stall.find({ isAvailable: true });
   console.log(availableStalls);
    res.json({ availableStalls });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Select a stall and mark it as unavailable
export const selectStall = async (req: Request, res: Response) => {
  try {
    const { stallId } = req.body;

    if (!stallId) {
      return res.status(400).json({ error: 'Missing stallId' });
    }

    // Check if the stall is available
    const stall = await Stall.findOneAndUpdate(
      { _id: stallId, isAvailable: true }, // Only update if the stall is available
      { $set: { isAvailable: false } }, // Mark as unavailable
      { new: true } // Return the updated document
    );

    if (!stall) {
      return res.status(400).json({ error: 'Stall is already selected or unavailable' });
    }

    res.json({ message: 'Stall selected successfully', stall });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const uploadStallImages = [
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'wall1', maxCount: 1 },
    { name: 'wall2', maxCount: 1 },
    { name: 'wall3', maxCount: 1 },
    { name: 'wall4', maxCount: 1 }, // Added wall4
  ]),
  async (req: Request, res: Response) => {
    try {
      const { stallId, userId, zone } = req.body;

      // Cast req.files to the Files interface
      const files = req.files as Files;

      // Check if required fields and files are provided
      if (!stallId || !userId || !files.logo || !files.wall1 || !files.wall2 || !files.wall3 || !files.wall4) {
        return res.status(400).json({ error: 'Missing required fields or files' });
      }

      // Extract image buffers from the request
      const logoFile = files.logo[0];
      const wall1File = files.wall1[0];
      const wall2File = files.wall2[0];
      const wall3File = files.wall3[0];
      const wall4File = files.wall4[0]; // Extract wall4

      const logoBuffer = logoFile.buffer;
      const wall1Buffer = wall1File.buffer;
      const wall2Buffer = wall2File.buffer;
      const wall3Buffer = wall3File.buffer;
      const wall4Buffer = wall4File.buffer; // Get wall4 buffer

      // Get file extensions for validation or processing
      const logoFormat = await getFileExtension(logoFile.originalname);
      const wall1Format = await getFileExtension(wall1File.originalname);
      const wall2Format = await getFileExtension(wall2File.originalname);
      const wall3Format = await getFileExtension(wall3File.originalname);
      const wall4Format = await getFileExtension(wall4File.originalname); // For wall4

      // Optionally, you can validate file extensions here before uploading (e.g., allow only 'jpg', 'png', etc.)
      if (!['jpg', 'jpeg', 'png'].includes(logoFormat) || 
          !['jpg', 'jpeg', 'png'].includes(wall1Format) || 
          !['jpg', 'jpeg', 'png'].includes(wall2Format) || 
          !['jpg', 'jpeg', 'png'].includes(wall3Format) ||
          !['jpg', 'jpeg', 'png'].includes(wall4Format)) {  // Wall4 validation
        return res.status(400).json({ error: 'Invalid file format. Only jpg, jpeg, and png are allowed.' });
      }

      // Convert the file buffers into readable streams
      const logoStream = Readable.from(logoBuffer);
      const wall1Stream = Readable.from(wall1Buffer);
      const wall2Stream = Readable.from(wall2Buffer);
      const wall3Stream = Readable.from(wall3Buffer);
      const wall4Stream = Readable.from(wall4Buffer); // Wall4 stream

      // Upload images to S3 and get the URLs
      const imageUrls = await selectStallAndUploadImages(stallId, userId, zone,{ 
        logoStream, wall1Stream, wall2Stream, wall3Stream, wall4Stream 
      });

      // Send success response
      res.json({ message: 'Images uploaded successfully', imageUrls });

    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
];
