import mongoose from 'mongoose';

console.log(`MongoDB_URI:`, process.env.MONGODB_URI);

const connectionString = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado a MongoDB Atlas');
    } catch (error) {
        console.error('Error al conectar a MongoDB Atlas:', error);
        process.exit(1); // Salir del proceso si hay un error de conexión
    }
};

export default connectDB;
