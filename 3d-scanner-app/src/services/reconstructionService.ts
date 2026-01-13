import { Model3D, CreateModel3DInput, ProcessingStatus } from "../types/model.types";

export const createModel = async (input: CreateModel3DInput): Promise<Model3D> => {
    try {
        console.log('Creating 3D model (MOCK)...');

        await delay(3000);
        const modelId = generateId();
        const timestamp = new Date().toISOString();

        const mockModelPath = `file://mock/models/${modelId}.glb`;

        const model: Model3D = {
            id: modelId,
            name: input.name || `Model ${new Date().toLocaleDateString()}`,
            createdAt: timestamp,
            updatedAt: timestamp,
            format: input.format || 'glb',
            filePath: mockModelPath,
            fileSize: 1024 * 512,
            thumbnailPath: input.frameUris[0],
            vertexCount: 15420,
            faceCount: 30840,
            textureCount: 1,
            status: 'completed' as ProcessingStatus,
            processingTime: 3,
            frameCount: input.frameUris.length,
            description: `3D model created from ${input.frameUris.length} frames`,
            tags: ['scanned', 'mobile'],
        };

        console.log('Mock 3D model created:', model.id);
        return model;
    } catch (err) {
        console.error('Model creation error:', err);
        throw new Error('3D მოდელის შექმნა ვერ მოხერხდა');
    }
};

export const getModelStatus = async (modelId: string): Promise<ProcessingStatus> => {
    return 'completed';
};

export const deleteModel = async (modelId: string): Promise<void> => {
    try {
        console.log('Deleting model (MOCK):', modelId);
        // TODO: Real file deletion
        await delay(500);
        console.log('Model deleted');
    } catch (err) {
        console.error('Model deletion error:', err);
        throw new Error('3D მოდელის წაშლა ვერ მოხერხდა');
    }
};

const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const generateId = (): string => {
    return `model_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
   * TODO: Real Cloud API Integration
   *
   * export const createModelWithAPI = async (input: CreateModel3DInput): Promise<Model3D> => {
   *   // 1. Upload frames to cloud
   *   const uploadResponse = await uploadFrames(input.frameUris);
   *
   *   // 2. Start reconstruction job
   *   const job = await startReconstruction(uploadResponse.uploadId);
   *
   *   // 3. Poll job status
   *   const model = await waitForCompletion(job.jobId);
   *
   *   // 4. Download model file
   *   await downloadModel(model.id);
   *
   *   return model;
   * };
   */