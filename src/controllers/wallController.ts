import { Request, Response } from 'express';
import * as wallService from '../services/wallService';

// Create a new wall upload
export const createWallUpload = async (req: Request, res: Response) => {
  try {
    const wallData = req.body;
    const newWallUpload = await wallService.createWallUpload(wallData);
    res.status(201).json(newWallUpload);
  } catch (error:any) {
    res.status(400).json({ message: error.message });
  }
};

// Get all walls for a specific stall
export const getWallsForStall = async (req: Request, res: Response) => {
  const { stallId } = req.params;
  try {
    const walls = await wallService.getWallsForStall(stallId);
    res.status(200).json(walls);
  } catch (error:any) {
    res.status(400).json({ message: error.message });
  }
};

// Get a specific wall upload by ID
export const getWallById = async (req: Request, res: Response) => {
  const { wallId } = req.params;
  try {
    const wall = await wallService.getWallById(wallId);
    res.status(200).json(wall);
  } catch (error:any) {
    res.status(404).json({ message: error.message });
  }
};

// Update a wall upload by ID
export const updateWallUpload = async (req: Request, res: Response) => {
  const { wallId } = req.params;
  const wallData = req.body;
  try {
    const updatedWall = await wallService.updateWallUpload(wallId, wallData);
    res.status(200).json(updatedWall);
  } catch (error:any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a wall upload by ID
export const deleteWallUpload = async (req: Request, res: Response) => {
  const { wallId } = req.params;
  try {
    const deletedWall = await wallService.deleteWallUpload(wallId);
    res.status(200).json(deletedWall);
  } catch (error:any) {
    res.status(400).json({ message: error.message });
  }
};
