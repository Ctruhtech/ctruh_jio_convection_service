import { Router } from 'express';
import * as wallController from '../controllers/wallController';

export const wallRoutes = Router();

// Define routes for CRUD operations on walls
wallRoutes.post('/', wallController.createWallUpload); // Create a new wall upload
wallRoutes.get('/stall/:stallId', wallController.getWallsForStall); // Get walls for a specific stall
wallRoutes.get('/:wallId', wallController.getWallById); // Get a specific wall upload
wallRoutes.put('/:wallId', wallController.updateWallUpload); // Update a wall upload
wallRoutes.delete('/:wallId', wallController.deleteWallUpload); // Delete a wall upload
