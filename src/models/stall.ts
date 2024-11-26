import mongoose, { Document, Schema } from "mongoose";

interface IStall extends Document {
  name: string;
  isAvailable: boolean;
  userId?: string;
  logoUrl?: string;
  wall1Url?: string;
  wall2Url?: string;
  wall3Url?: string;
  wall4Url?: string;
  zone?: number;
  uniqueCode?: string;
  wallsCount?: number;
}

const StallSchema: Schema = new Schema({
  name: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  userId: { type: String, required: false },
  logoUrl: { type: String, required: false },
  wall1Url: { type: String, required: false },
  wall2Url: { type: String, required: false },
  wall3Url: { type: String, required: false },
  wall4Url: { type: String, required: false },
  zone: { type: Number, required: false },
  uniqueCode: { type: String, required: false },
  wallsCount: { type: Number, required: false , default: null},
});

const Stall = mongoose.model<IStall>("Stall", StallSchema);

export { Stall, IStall };
