import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Model3D } from '../types/model.types';

const MODELS_KEY = '@3d_scanner_models';

export const saveModel = async (model: Model3D): Promise<string> => {
    try {
        const existingModels = await getAllModels();

        const modelExists = existingModels.some(m => m.id === model.id);

        let updatedModels: Model3D[];
        if (modelExists) {
            updatedModels = existingModels.map(m =>
                m.id === model.id ? { ...model, updatedAt: new Date().toISOString() } : m
            );
            console.log('Model updated:', model.id);
        } else {
            updatedModels = [...existingModels, model];
            console.log('Model saved:', model.id);
        }

        await AsyncStorage.setItem(MODELS_KEY, JSON.stringify(updatedModels));
        return model.id;
    } catch (err) {
        console.error('Error saving model:', err);
        throw new Error('მოდელის შენახვა ვერ მოხერხდა');
    }
};

export const loadModel = async (id: string): Promise<Model3D> => {
    try {
        const models = await getAllModels();
        const model = models.find(m => m.id === id);
        
        if (!model) {
            throw new Error(`Model with id ${id} not found`);
        }

        console.log('Model loaded:', id);
        return model;
    } catch (err) {
        console.error('Error loading model:', err);
        throw new Error('მოდელის ჩატვირთვა ვერ მოხერხდა');
    }
};

export const deleteModel = async (id: string): Promise<void> => {
    try {
        const models = await getAllModels();
        const modelToDelete = models.find(m => m.id === id);

        if (!modelToDelete) {
            throw new Error(`Model with id ${id} not found`);
        }

        const updatedModels = models.filter(m => m.id !== id);
        await AsyncStorage.setItem(MODELS_KEY, JSON.stringify(updatedModels));

        // TODO: Real implementation in 3D file deletion
        console.log(`Model deleted:`, id);
    } catch (err) {
        console.error('Error deleting model:', err);
        throw new Error('მოდელის წაშლა ვერ მოხერხდა');
    }
};

export const getAllModels = async (): Promise<Model3D[]> => {
    try {
        const modelsJson = await AsyncStorage.getItem(MODELS_KEY);

        if (!modelsJson) {
            return [];
        }

        const models: Model3D[] = JSON.parse(modelsJson);

        return models.sort((a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    } catch (err) {
        console.error('Error getting all models:', err);
        return [];
    }
};

export const clearAllModels = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(MODELS_KEY);
        console.log('All models cleared from storage');
    } catch (err) {
        console.error('Error clearing models:', err);
        throw new Error('Storage-ის გასუფთავება ვერ მოხერხდა');
    }
};

export const getStorageStats = async (): Promise<{ count: number, totalSize: number }> => {
    try {
        const models = await getAllModels();
        const count = models.length;
        const totalSize = models.reduce((sum, model) => sum + (model.fileSize || 0), 0);
        
        return { count, totalSize };
    } catch (err) {
        console.error('Error getting storage stats:', err);
        return { count: 0, totalSize: 0 };
    }
};