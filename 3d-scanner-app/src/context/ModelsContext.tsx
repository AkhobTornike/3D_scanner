import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Model3D } from "../types/model.types";
import { getAllModels, saveModel, deleteModel as deleteModelFromStorage, getStorageStats  } from "../services/storageService";

interface ModelsState {
    models: Model3D[];
    loading: boolean;
    error: string | null;
    stats: {
        count: number;
        totalSize: number;
    };
}

interface ModelsContextValue extends ModelsState {
    loadModels: () => Promise<void>;
    addModel: (model: Model3D) => Promise<void>;
    removeModel: (modelId: string) => Promise<void>;
    updateModel: (model: Model3D) => Promise<void>;
    getModelById: (modelId: string) => Model3D | undefined;
    refreshStats: () => Promise<void>;
}

const initialState: ModelsState = {
    models: [],
    loading: true,
    error: null,
    stats: {
        count: 0,
        totalSize: 0,
    },
};

const ModelsContext = createContext<ModelsContextValue | undefined>(undefined);

interface ModelsProviderProps {
    children: ReactNode;
}

export const ModelsProvider: React.FC<ModelsProviderProps> = ({ children }) => {
    const [state, setState] = useState<ModelsState>(initialState);

    const loadModels = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));

            const models = await getAllModels();
            const stats = await getStorageStats();

            setState(prev => ({
                ...prev,
                models,
                stats,
                loading: false,
            }));

            console.log(`Loaded ${models.length} models`);
        } catch (err) {
            console.error('Error loading models:', err);
            setState(prev => ({
                ...prev,
                loading: false,
                error: 'მოდელების ჩატვირთვა ვერ მოხერხდა',
            }));
        }
    }, []);

    const addModel = useCallback(async (model: Model3D) => {
      try {
        await saveModel(model);

        setState(prev => ({
          ...prev,
          models: [model, ...prev.models],
          stats: {
            count: prev.stats.count + 1,
            totalSize: prev.stats.totalSize + model.fileSize,
          },
        }));

        console.log('Model added:', model.id);
      } catch (error) {
        console.error('Error adding model:', error);
        throw new Error('მოდელის დამატება ვერ მოხერხდა');
      }
    }, []);

    const removeModel = useCallback(async (modelId: string) => {
        try {
            const modelToRemove = state.models.find(m => m.id === modelId);

            await deleteModelFromStorage(modelId);

            setState(prev => ({
                ...prev,
                models: prev.models.filter(m => m.id !== modelId),
                stats: {
                    count: prev.stats.count - 1,
                    totalSize: prev.stats.totalSize - (modelToRemove?.fileSize || 0),
                },
            }));

            console.log('Model removed:', modelId);
        } catch (err) {
            console.error('Error removing model:', err);
            throw new Error('მოდელის წაშლა ვერ მოხერხდა');
        }
    }, [state.models]);

    const updateModel = useCallback(async (model: Model3D) => {
        try {
            await saveModel(model);

            setState(prev => ({
                ...prev,
                models: prev.models.map(m => m.id === model.id ? model : m),
            }));

            console.log('Model updated:', model.id);
        } catch (err) {
            console.error('Error updating model:', err);
            throw new Error('მოდელის განახლება ვერ მოხერხდა');
        }
    }, []);

    const getModelById = useCallback((modelId: string): Model3D | undefined => {
        return state.models.find(m => m.id === modelId);
    }, [state.models]);

    const refreshStats = useCallback(async () => {
        try {
            const stats = await getStorageStats();
            setState(prev => ({ ...prev, stats }));
        } catch (err) {
            console.error('Error refreshing stats:', err);
        }
    }, []);

    useEffect(() => {
        loadModels();
    }, [loadModels]);

    const value: ModelsContextValue = {
        ...state,
        loadModels,
        addModel,
        removeModel,
        updateModel,
        getModelById,
        refreshStats,
    };

    return (
        <ModelsContext.Provider value={value}>
            {children}
        </ModelsContext.Provider>
    );
};

export const useModels = (): ModelsContextValue => {
    const context = useContext(ModelsContext);

    if (context === undefined) {
        throw new Error('useModels must be used withing a ModelsProvider');
    }

    return context;
};

export { ModelsContext };