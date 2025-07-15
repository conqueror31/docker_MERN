import mongoose from "mongoose";

export const dbConnection = async () => {
  const connectionOptions = {
    dbName: process.env.DB_NAME || "myappdb",
    autoIndex: process.env.NODE_ENV !== "production", // Better performance in prod
    maxPoolSize: 10, // Maximum number of sockets
    serverSelectionTimeoutMS: 5000, // Timeout after 5s
    socketTimeoutMS: 45000 // Close sockets after 45s inactivity
  };

  try {
    await mongoose.connect(process.env.MONGO_URI, connectionOptions);
    
    mongoose.connection.on("connected", () => {
      console.log(`MongoDB connected to database: ${mongoose.connection.db.databaseName}`);
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed due to app termination");
      process.exit(0);
    });

  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit with failure
  }
};
