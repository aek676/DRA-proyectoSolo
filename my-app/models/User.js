import mongoose from "mongoose";

// 1. Define the schema for an individual translation
const TranslationHistorySchema = new mongoose.Schema({
  originalText: {
    type: String,
    required: [true, "Original text is required."],
  },
  translatedText: {
    type: String,
    required: [true, "Translated text is required."],
  },
  sourceLanguage: {
    type: String,
    required: [true, "Source language is required."],
  },
  targetLanguage: {
    type: String,
    required: [true, "Target language is required."],
  },
  timestamp: {
    type: Date,
    default: Date.now, // By default, use current date and time if not provided
  },
});

// 2. Define the schema for the user
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: true, // Ensures usernames are unique
      trim: true, // Removes whitespace at beginning/end
      maxlength: [50, "Username cannot exceed 50 characters."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [6, "Password must have at least 6 characters."],
    },
    translationHistory: [TranslationHistorySchema], // Translation history is an array of TranslationHistorySchema
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
); // Mongoose adds createdAt and updatedAt automatically if set to true

// 3. Compile the model and export it
// This prevents "OverwriteModelError" in Next.js during hot-reloading
// Define a model or get it if it already exists
// This helps prevent "Cannot overwrite model once compiled" errors
let User;

try {
  // Try to get the existing model
  User = mongoose.model("User");
} catch (error) {
  // If the model doesn't exist, create it
  User = mongoose.model("User", UserSchema);
}

export default User;
