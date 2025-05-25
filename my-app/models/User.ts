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

// Definición del modelo
export type UserModelType = mongoose.Model<IUser>;

// Importamos el modelo desde el archivo JS
import User from './User';

export default User as UserModelType;
