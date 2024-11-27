import express from "express";
import multer from "multer";
import {
  createStall,
  getAvailableStalls,
  getStallsById,
  getStallsByZone,
  handleDeleteImage,
  handleImageUpload,
  handleUpdateImageUpload,
  updateStall,
} from "../controllers/stallController";

const router = express.Router();
router.get("/stalls/available", getAvailableStalls);
router.post("/stalls", createStall);
router.get("/stalls/getById/:id", getStallsById);
router.get("/stalls/getByZone/:zone", getStallsByZone);
router.delete("/stalls/delete",handleDeleteImage)
router.put("/stalls", updateStall);
// Multer storage setup for file upload operations
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 1024 * 1 },
});

// Route to upload images for the selected stall
router.post(
  "/stalls/upload-images",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "wall1", maxCount: 1 },
    { name: "wall2", maxCount: 1 },
    { name: "wall3", maxCount: 1 },
    { name: "wall4", maxCount: 1 },
  ]),
  handleImageUpload
);
router.post(
  "/stalls/upload-images-update",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "wall1", maxCount: 1 },
    { name: "wall2", maxCount: 1 },
    { name: "wall3", maxCount: 1 },
    { name: "wall4", maxCount: 1 },
  ]),
  handleUpdateImageUpload
);

export default router;
