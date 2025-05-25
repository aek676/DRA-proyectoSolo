import mongoose from 'mongoose';

// Definición del tipo para la historia de traducciones
export interface ITranslationHistory {
    originalText: string;
    translatedText: string;
    sourceLanguage: string;
    targetLanguage: string;
    timestamp: Date;
}

// Definición del tipo para el usuario
export interface IUser {
    _id: mongoose.Types.ObjectId;
    username: string;
    password: string;
    translationHistory: ITranslationHistory[];
    createdAt: Date;
    updatedAt: Date;
}

// Definición del tipo para el modelo
declare const User: mongoose.Model<IUser>;
export default User;
