import WallUpload, { IWallUpload } from "../models/wallUpload"

// Create a wall upload for a stall
export const createWallUpload = async (wallData: IWallUpload) => {
  try {
    const newWallUpload = new WallUpload(wallData);
    await newWallUpload.save();
    return newWallUpload;
  } catch (error) {
    throw new Error('Error creating wall upload');
  }
};

// Get all walls for a specific stall
export const getWallsForStall = async (stallId: string) => {
  try {
    return await WallUpload.find({ stallId });
  } catch (error) {
    throw new Error('Error fetching walls for stall');
  }
};

// Get a specific wall by ID
export const getWallById = async (wallId: string) => {
  try {
    const wall = await WallUpload.findById(wallId);
    if (!wall) throw new Error('Wall not found');
    return wall;
  } catch (error) {
    throw new Error('Error fetching wall');
  }
};

// Update a wall upload
export const updateWallUpload = async (wallId: string, wallData: Partial<IWallUpload>) => {
  try {
    const updatedWall = await WallUpload.findByIdAndUpdate(wallId, wallData, { new: true });
    if (!updatedWall) throw new Error('Wall not found');
    return updatedWall;
  } catch (error) {
    throw new Error('Error updating wall upload');
  }
};

// Delete a wall upload
export const deleteWallUpload = async (wallId: string) => {
  try {
    const deletedWall = await WallUpload.findByIdAndDelete(wallId);
    if (!deletedWall) throw new Error('Wall not found');
    return deletedWall;
  } catch (error) {
    throw new Error('Error deleting wall upload');
  }
};
