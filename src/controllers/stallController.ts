import { Request, Response } from "express";
import { Stall } from "../models/stall";
import { Readable } from "stream";
import {
  deleteStallImageService,
  updateStallImagesService,
  uploadStallImagesService,
} from "../services/stallService";
import multer from "multer";
import crypto from "crypto";
import { ObjectId } from "mongodb";

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
    const { name, wallsCount, zone } = req.body;
    // Check if the 'name' is provided
    if (!name) {
      return res.status(400).json({ error: "Stall name is required" });
    }

    // Generate a unique 8-character alphanumeric code
    const uniqueCode = crypto.randomBytes(4).toString("hex").toUpperCase(); // 8 characters

    // Create a new stall with 'isAvailable' set to true by default, and other fields
    const newStall = new Stall({
      name,
      isAvailable: true,
      zone,
      uniqueCode,
      wallsCount,
    });
    // Save the new stall to the database
    await newStall.save();

    // Return success response
    res
      .status(201)
      .json({ message: "Stall created successfullydd", stall: newStall });
  } catch (error: any) {
    // Handle errors and send a response
    res.status(500).json({ error: error.message });
  }
};

// Get all available stalls
export const getAvailableStalls = async (req: Request, res: Response) => {
  try {
    // Fetch all stalls that are available
    const availableStalls = await Stall.find().select("_id name");
    res.json({ availableStalls });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Select a stall and mark it as unavailable
// export const selectStall = async (req: Request, res: Response) => {
//   try {
//     const { stallId } = req.body;

//     if (!stallId) {
//       return res.status(400).json({ error: "Missing stallId" });
//     }

//     // Check if the stall is available
//     const stall = await Stall.findOneAndUpdate(
//       { _id: stallId, isAvailable: true }, // Only update if the stall is available
//       { $set: { isAvailable: false } }, // Mark as unavailable
//       { new: true } // Return the updated document
//     );

//     if (!stall) {
//       return res
//         .status(400)
//         .json({ error: "Stall is already selected or unavailable" });
//     }

//     res.json({ message: "Stall selected successfully", stall });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };

export const handleImageUpload = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Dynamically extract files if they exist in the request
    const files = req.files || {};

    const logoStream = files["logo"]
      ? Readable.from(files["logo"][0]?.buffer)
      : null;
    const wall1Stream = files["wall1"]
      ? Readable.from(files["wall1"][0]?.buffer)
      : null;
    const wall2Stream = files["wall2"]
      ? Readable.from(files["wall2"][0]?.buffer)
      : null;
    const wall3Stream = files["wall3"]
      ? Readable.from(files["wall3"][0]?.buffer)
      : null;
    const wall4Stream = files["wall4"]
      ? Readable.from(files["wall4"][0]?.buffer)
      : null;

    // Extract stallId and uniqueCode from the request body
    const { stallId, uniqueCode } = req.body;

    // Call the service function to handle image upload and stall update
    const imageUrls = await uploadStallImagesService(
      stallId,
      uniqueCode,
      logoStream,
      wall1Stream,
      wall2Stream,
      wall3Stream,
      wall4Stream
    );

    // Send success response with the uploaded image URLs
    res.status(200).json({
      message: "Images uploaded successfully",
      imageUrls,
    });
  } catch (error: any) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: error.message });
  }
};
export const handleUpdateImageUpload = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Dynamically extract files if they exist in the request
    const files = req.files || {};

    const logoStream = files["logo"]
      ? Readable.from(files["logo"][0]?.buffer)
      : null;
    const wall1Stream = files["wall1"]
      ? Readable.from(files["wall1"][0]?.buffer)
      : null;
    const wall2Stream = files["wall2"]
      ? Readable.from(files["wall2"][0]?.buffer)
      : null;
    const wall3Stream = files["wall3"]
      ? Readable.from(files["wall3"][0]?.buffer)
      : null;
    const wall4Stream = files["wall4"]
      ? Readable.from(files["wall4"][0]?.buffer)
      : null;

    // Extract stallId and uniqueCode from the request body
    const { stallId, uniqueCode } = req.body;

    // Call the service function to update images
    const imageUrls = await updateStallImagesService(
      stallId,
      uniqueCode,
      logoStream,
      wall1Stream,
      wall2Stream,
      wall3Stream,
      wall4Stream
    );

    // Send success response with the updated image URLs
    res.status(200).json({
      message: "Images updated successfully",
      imageUrls,
    });
  } catch (error: any) {
    console.error("Error updating images:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getStallsById = async (req: Request, res: Response) => {
  try {
    let id = new ObjectId((req.params.id).toString());
    // Fetch all stalls that are available
    const availableStalls = await Stall.findById(id).select(
      "_id name logoUrl wall1Url wall2Url wall3Url wall4Url wallsCount zone"
    );
    if (!availableStalls) {
      return res.status(400).json({ error: "Stall not found" });
    }
    res.json({ availableStalls });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const getStallsByZone = async (req: Request, res: Response) => {
  try {
    let zone = Number(req.params.zone);
    // Fetch all stalls that are available
    const availableStalls = await Stall.find({ zone: zone }).select(
      "_id name logoUrl wall1Url wall2Url wall3Url wall4Url wallsCount zone"
    );
    if (!availableStalls) {
      return res.status(400).json({ error: "Stall not found" });
    }
    res.json({ availableStalls });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const handleDeleteImage = async (req: Request, res: Response) => {
  try {
    const { stallId, imageType, uniqueCode } = req.body; // Extract stallId and imageType from request body

    // Validate imageType
    const validImageTypes = ["logo", "wall1", "wall2", "wall3", "wall4"];
    if (!validImageTypes.includes(imageType)) {
      return res.status(400).json({ error: "Invalid image type" });
    }

    // Call the delete service
    await deleteStallImageService(stallId, uniqueCode, imageType);

    // Send success response
    res.status(200).json({ message: `${imageType} deleted successfully` });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: error.message });
  }
};
