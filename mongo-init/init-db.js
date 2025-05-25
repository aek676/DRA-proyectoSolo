// mongo-init/init-db.js

// Nos aseguramos de estar en la base de datos 'Frasea'
// (el nombre de la DB según tu último docker-compose.yml)
db = db.getSiblingDB("Frasea");

// --- Definición y creación de la colección 'users' ---
// Opcional: Eliminar la colección si ya existe para asegurar un estado limpio en cada inicialización
// (Solo útil si ejecutas `down -v` y luego `up -d` para reiniciar completamente)
// db.users.drop();

// Crea la colección 'users'
db.createCollection("users");

// --- Insertar un usuario de ejemplo con historial de traducciones ---
db.users.insertOne({
  username: "testuser",
  password: "123456", // ¡ADVERTENCIA! En producción, siempre hashea las contraseñas.
  createdAt: new Date(),
  updatedAt: new Date(),
  translationHistory: [
    {
      originalText: "Hello world",
      translatedText: "Hola mundo",
      sourceLanguage: "en",
      targetLanguage: "es",
      timestamp: new Date(ISODate("2025-05-20T10:00:00Z")), // Fecha de ejemplo
    },
    {
      originalText: "How are you?",
      translatedText: "¿Cómo estás?",
      sourceLanguage: "en",
      targetLanguage: "es",
      timestamp: new Date(ISODate("2025-05-20T10:15:00Z")),
    },
    {
      originalText: "Thank you very much",
      translatedText: "Muchas gracias",
      sourceLanguage: "en",
      targetLanguage: "es",
      timestamp: new Date(ISODate("2025-05-21T11:30:00Z")),
    },
    {
      originalText: "Guten Tag",
      translatedText: "Buenos días",
      sourceLanguage: "de",
      targetLanguage: "es",
      timestamp: new Date(ISODate("2025-05-22T14:00:00Z")),
    },
  ],
});

// --- Opcional: Crear índices para la colección 'users' ---
db.users.createIndex({ username: 1 }, { unique: true }); // Índice único para el username
db.users.createIndex({ "translationHistory.timestamp": -1 }); // Índice para ordenar historial por fecha descendente

print("Database 'Frasea' initialized with 'users' collection and a test user.");

// --- Opcional: Puedes seguir agregando otras colecciones aquí si las necesitas ---
// db.createCollection('frasesEjemplos');
// db.frasesEjemplos.insertOne({ texto: 'Otra frase.', autor: 'Otro autor.' });
