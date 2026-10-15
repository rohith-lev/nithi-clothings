import mongoose, { Schema, Document } from "mongoose";

export interface IMedia extends Document {
  filename: string;
  contentType: string;
  data: Buffer;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<IMedia>(
  {
    filename: { type: String, required: true, unique: true, index: true },
    contentType: { type: String, required: true, default: "image/jpeg" },
    data: { type: Buffer, required: true },
    size: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation error in development hot reload
const Media = mongoose.models.Media || mongoose.model<IMedia>("Media", mediaSchema);

export default Media;
