import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dns from "dns";

try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {}

const ATLAS_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://nithicollection2026_db_user:Nithi%402026@cluster0.cibj19h.mongodb.net/nithi_collection?retryWrites=true&w=majority&appName=Cluster0";

const mediaSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true, unique: true, index: true },
    contentType: { type: String, required: true, default: "image/jpeg" },
    data: { type: Buffer, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: true }
);

const Media = mongoose.models.Media || mongoose.model("Media", mediaSchema);

function detectMime(buffer) {
  if (buffer.length >= 8) {
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return "image/jpeg";
    }
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      return "image/png";
    }
    if (
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP"
    ) {
      return "image/webp";
    }
  }
  return "image/jpeg";
}

async function run() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(ATLAS_URI, {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
  });
  console.log("Connected to MongoDB Atlas!");

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    console.log("No public/uploads directory found.");
    process.exit(0);
  }

  const files = fs.readdirSync(uploadDir);
  console.log(`Found ${files.length} local files in public/uploads.`);

  let imported = 0;
  for (const filename of files) {
    const filePath = path.join(uploadDir, filename);
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) continue;

    const buffer = fs.readFileSync(filePath);
    const contentType = detectMime(buffer);

    await Media.findOneAndUpdate(
      { filename },
      {
        filename,
        contentType,
        data: buffer,
        size: buffer.length,
      },
      { upsert: true, new: true }
    );
    imported++;
    console.log(`✓ Stored ${filename} (${(buffer.length / 1024).toFixed(1)} KB) as ${contentType}`);
  }

  console.log(`Successfully migrated ${imported} image files into MongoDB Atlas Media collection!`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
