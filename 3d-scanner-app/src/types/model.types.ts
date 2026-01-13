export type Model3DFormat = 'obj' | 'glb' | 'stl' | 'ply';
export type ProcessingStatus =
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed';

export interface Model3D {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    format: Model3DFormat;
    filePath: string;
    fileSize: number;
    thumbnailPath?: string;
    vertexCount?: number;
    faceCount?: number;
    textureCount?: number;
    status: ProcessingStatus;
    processingTime?: number;
    frameCount?: number;
    description?: string;
    tags?: string[];
}

export interface CreateModel3DInput {
    name: string;
    frameUris: string[];
    format?: Model3DFormat;
}

export interface UpdateModelInput {
    name?: string;
    description?: string;
    tags?: string[];
}

export interface ReconstructionJob {
    jobId: string;
    status: ProcessingStatus;
    progress: number;
    modelId?: string;
    error?: string;
    createdAt: Date;
    completedAt?: Date;
}

export interface ModelStatistics {
    totalModels: number;
    totalSize: number;
    averageProcessingTime: number;
    recentModels: Model3D[];
}

