import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB is Successfully Connected ${conn.connection.host}` .blue.bold);
  } catch (error) {
    console.log(`Error while Conn MD ${error.message} `);
    process.exit(1);
  }
};
export default connectDB;
