import express from 'express';
import { createStall, getAvailableStalls, selectStall, uploadStallImages } from '../controllers/stallController';

const router = express.Router();

// Route to create a new stall
router.post('/stalls', createStall);

// Route to get all available stalls
router.get('/stalls/available', getAvailableStalls);

// Route to select a stall (mark as unavailable)
router.post('/stalls/select', selectStall);

// Route to upload images for the selected stall
router.post('/stalls/upload-images', uploadStallImages);

export default router;
