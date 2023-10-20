import mongoose from 'mongoose';

const connectDB = async () => {
    const connect = async () => {
        try {
            const conn = await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            });

            console.log(`MongoDB Connected: ${conn.connection.host}`);
        } catch (error) {
            console.error(`Error connecting to MongoDB: ${error.message}`);
            // Implement retry or error handling logic here
        }
    };

    // Retry connection in case of failures
    const retryDelayMs = 5000; // 5 seconds
    while (true) {
        try {
            await connect();
            break;
        } catch (error) {
            console.error(`Retry in ${retryDelayMs / 1000} seconds...`);
            await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
        }
    }
};

export default connectDB;
