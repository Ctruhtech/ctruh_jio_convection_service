import mongoose, { Schema, Document } from 'mongoose';

// WallUpload Model Schema
export interface IWallUpload extends Document {
  stallId: mongoose.Types.ObjectId; // Reference to the Stall
  wallNumber: number;
  imageUrl: string;
  imageSize: number;
  description: string;
}

const wallUploadSchema = new Schema<IWallUpload>({
  stallId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Stall', 
    required: true 
  },
  wallNumber: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 3 
  },
  imageUrl: { 
    type: String, 
    required: true 
  },
  imageSize: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String, 
    required: false 
  }
}, { timestamps: true });

const WallUpload = mongoose.model<IWallUpload>('WallUpload', wallUploadSchema);

export default WallUpload;
