import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// No verificamos la variable MONGODB_URI aquí, lo haremos solo cuando se llame a dbConnect()
// Esto permite que el build funcione aunque la variable no esté definida

// Type for connection cache
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// Global type declaration for cache
declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: MongooseCache | undefined;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents recreating new connections to the database
 * every time a code change is saved.
 */
let cached = global.mongooseCache;

if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
    // Asegurar que cached no sea undefined
    if (!cached) {
        cached = global.mongooseCache = { conn: null, promise: null };
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            // useNewUrlParser: true, // Estas opciones se suelen recomendar, pero a veces no son estrictamente necesarias
            // useUnifiedTopology: true, // en versiones recientes de Mongoose. Puedes probar sin ellas si hay errores.
        };

        // Verificamos MONGODB_URI solo cuando se intenta conectar realmente
        if (!MONGODB_URI) {
            console.error('Error: MONGODB_URI no está definido en las variables de entorno');
            throw new Error(
                'Please define the MONGODB_URI environment variable inside .env.local'
            );
        }

        console.log('Intentando conectar a MongoDB en:', MONGODB_URI.replace(/:([^:@]+)@/, ':****@')); // Oculta la contraseña en logs

        try {
            cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
                console.log('Conexión a MongoDB establecida correctamente');
                return mongoose;
            });
        } catch (error) {
            console.error('Error al conectar con MongoDB:', error);
            throw error;
        }
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;