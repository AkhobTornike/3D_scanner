import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Model3D, Model3DFormat } from '../types/model.types';

export const EXPORT_FORMATS: { format: Model3DFormat; label: string; description: string }[] = [
    { format: 'glb', label: 'GLB', description: 'GLTF Binary - Web & AR' },
    { format: 'obj', label: 'OBJ', description: 'Wavefront - Universal' },
    { format: 'stl', label: 'STL', description: '3D Printing' },
];

export const isValidExportFormat = (format: string): format is Model3DFormat => {
    return ['glb', 'obj', 'stl', 'ply'].includes(format);
}

export const exportModel = async (
    model: Model3D,
    targetFormat: Model3DFormat
): Promise<string> => {
    try {
        console.log(`Exporting model ${model.name} to ${targetFormat}...`);

        if (!isValidExportFormat(targetFormat)) {
            throw new Error(`Unsupported format: ${targetFormat}`);
        }

        if (model.format === targetFormat) {
            console.log('Same format, no conversion needed');
            return model.filePath;
        }

        await delay(1500);
        
        const exportPath = `file://mock/exports/${model.id}.${targetFormat}`;

        // TODO: Real conversion would happen here
        console.log(`Mock export complete: ${exportPath}`);

        return exportPath;
    } catch (err) {
        console.error('Export error:', err);
        throw new Error('მოდელის ექსპორტი ვერ მოხერხდა');
    }
};

export const shareModel = async (
    model: Model3D,
    format?: Model3DFormat
): Promise<void> => {
    try {
        const isAvailable = await Sharing.isAvailableAsync();
        if (!isAvailable) {
            throw new Error('გაზიარება არ არის ხელმისაწვდომი ამ მოწყობილობაზე');
        }

        const targetFormat = format || model.format;
        const filePath = await exportModel(model, targetFormat);

        await Sharing.shareAsync(filePath, {
            mimeType: getMimeType(targetFormat),
            dialogTitle: `გაზიარება: ${model.name}`,
            UTI: getUTI(targetFormat),
        });

        console.log('Model shared successfully');
    } catch (err) {
        console.error('Share error:', err);
        throw new Error('მოდელის გაზიარება ვერ მოხერხდა');
    }
};

const getMimeType = (format: Model3DFormat): string => {
    const mimeTypes: Record<Model3DFormat, string> = {
        glb: 'model/gltf-binary',
        obj: 'text/plain',
        stl: 'application/sla',
        ply: 'application/x-ply',
    };
    return mimeTypes[format] || 'application/octet-stream';
};

const getUTI = (format: Model3DFormat): string => {
    const utis: Record<Model3DFormat, string> = {
        glb: 'public.geometry-definition-format',
        obj: 'public.geometry-definition-format',
        stl: 'public.standard-tesselated-geometry-format',
        ply: 'public.polygon-file-format',
    };
    return utis[format] || 'public.data';
};

export const saveToDevice = async (
    model: Model3D,
    format?: Model3DFormat
): Promise<void> => {
    try {
        const targetFormat = format || model.format;
        const filePath = await exportModel(model, targetFormat);

        const isAvailable = await Sharing.isAvailableAsync();
        if (!isAvailable) {
            throw new Error('შენახვა არ არის ხელმისაწვდომი');
        }

        await Sharing.shareAsync(filePath, {
            mimeType: getMimeType(targetFormat),
            dialogTitle: `შენახვა: ${model.name}.${targetFormat}`,
        });
    } catch (err) {
        console.error('Save to device error:', err);
        throw new Error('ფაილის შენახვა ვერ მოხერხდა');
    }
};

export const getExportSizeEstimate = (
    model: Model3D,
    targetFormat: Model3DFormat
): number => {
    const multipliers: Record<Model3DFormat, number> = {
        glb: 1.0,
        obj: 2.5,
        stl: 1.8,
        ply: 2.0,
    };
    return Math.round(model.fileSize * (multipliers[targetFormat] || 1.0));
};

const delay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));