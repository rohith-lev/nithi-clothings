import mongoose from "mongoose";
import dns from "dns";

// Use public DNS to reliably resolve MongoDB Atlas SRV records
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (dnsErr) {
  // Ignored if custom DNS setting is not permitted in this runtime
}

// Direct replica set seed list that bypasses SRV lookups completely
export const DIRECT_ATLAS_URI =
  "mongodb://nithicollection2026_db_user:Nithi%402026@ac-qiaedoa-shard-00-00.cibj19h.mongodb.net:27017,ac-qiaedoa-shard-00-01.cibj19h.mongodb.net:27017,ac-qiaedoa-shard-00-02.cibj19h.mongodb.net:27017/nithi_collection?ssl=true&replicaSet=atlas-y2ds45-shard-0&authSource=admin&retryWrites=true&w=majority";

const ATLAS_SRV_URI =
  "mongodb+srv://nithicollection2026_db_user:Nithi%402026@cluster0.cibj19h.mongodb.net/nithi_collection?retryWrites=true&w=majority&appName=Cluster0";

// Prefer env MONGODB_URI, or fall back to DIRECT_ATLAS_URI to prevent SRV DNS failures
const MONGODB_URI = process.env.MONGODB_URI || DIRECT_ATLAS_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage in serverless environments (Vercel).
 */
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const opts = {
    bufferCommands: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
  };

  const connectWithFallback = async (primaryUri: string): Promise<typeof mongoose> => {
    try {
      const m = await mongoose.connect(primaryUri, opts);
      console.log(`[MongoDB] Connected successfully: ${m.connection.name}`);
      return m;
    } catch (err: any) {
      const errMsg = err?.message || "";
      const isSrvError =
        errMsg.includes("querySrv") ||
        errMsg.includes("ECONNREFUSED") ||
        errMsg.includes("ENOTFOUND") ||
        err?.code === "ECONNREFUSED";

      if (isSrvError && primaryUri !== DIRECT_ATLAS_URI) {
        console.warn("[MongoDB] SRV lookup failed, switching to direct replica set URI...");
        const m = await mongoose.connect(DIRECT_ATLAS_URI, opts);
        console.log(`[MongoDB] Connected via direct replica set fallback: ${m.connection.name}`);
        return m;
      }

      throw err;
    }
  };

  if (!cached.promise || mongoose.connection.readyState === 0) {
    cached.promise = connectWithFallback(MONGODB_URI);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    throw e;
  }

  return cached.conn;
}
