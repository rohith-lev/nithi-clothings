import mongoose from "mongoose";
import dns from "dns";

// Use public DNS servers to help resolve SRV records
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch {
  // Ignored if not permitted in this runtime
}

// Primary URI — SRV format as requested (works on Vercel/Linux production)
const SRV_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://nithicollection2026_db_user:Nithi%402026@cluster0.cibj19h.mongodb.net/nithi_collection?retryWrites=true&w=majority&appName=Cluster0";

// Direct replica-set fallback — used when ISP/Windows blocks SRV (_mongodb._tcp) lookups
// Same cluster, same credentials, same database — just bypasses SRV DNS resolution
const DIRECT_URI =
  "mongodb://nithicollection2026_db_user:Nithi%402026@ac-qiaedoa-shard-00-00.cibj19h.mongodb.net:27017,ac-qiaedoa-shard-00-01.cibj19h.mongodb.net:27017,ac-qiaedoa-shard-00-02.cibj19h.mongodb.net:27017/nithi_collection?ssl=true&replicaSet=atlas-y2ds45-shard-0&authSource=admin&retryWrites=true&w=majority";

if (!SRV_URI) {
  throw new Error(
    "[MongoDB] MONGODB_URI is not set. Configure it in your deployment environment."
  );
}

const CONN_OPTS = {
  bufferCommands: false,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  // Always lock to nithi_collection — never fall into 'test' database
  dbName: "nithi_collection",
};

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

  if (!cached.promise || mongoose.connection.readyState === 0) {
    cached.promise = (async () => {
      // 1st attempt: SRV URI (works in production / Vercel)
      try {
        const m = await mongoose.connect(SRV_URI, CONN_OPTS);
        console.log(`[MongoDB] ✅ Connected via SRV: db=${m.connection.name}`);
        return m;
      } catch (srvErr: any) {
        const isSrvBlocked =
          srvErr?.message?.includes("querySrv") ||
          srvErr?.message?.includes("ECONNREFUSED") ||
          srvErr?.message?.includes("ENOTFOUND") ||
          srvErr?.code === "ECONNREFUSED";

        if (!isSrvBlocked) {
          // Not a DNS/SRV issue — re-throw immediately
          console.error("[MongoDB] Connection error (non-DNS):", srvErr?.message);
          throw srvErr;
        }

        // 2nd attempt: Direct seed-list URI (bypasses SRV lookup for Windows/ISP)
        console.warn("[MongoDB] ⚠️ SRV lookup blocked (querySrv ECONNREFUSED). Switching to direct replica-set URI...");
        try {
          const m = await mongoose.connect(DIRECT_URI, CONN_OPTS);
          console.log(`[MongoDB] ✅ Connected via direct replica-set: db=${m.connection.name}`);
          return m;
        } catch (directErr: any) {
          console.error("[MongoDB] Direct replica-set connection also failed:", directErr?.message);
          throw directErr;
        }
      }
    })();
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
