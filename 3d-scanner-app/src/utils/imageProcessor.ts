import * as ImageManipulator from 'expo-image-manipulator';
import { SaveFormat } from 'expo-image-manipulator';

export const optimizeImage = async (
    uri: string,
    targetWidth: number = 1920
): Promise<string> => {
    try {
        console.log('Optimizing image:', uri);

        const result = await ImageManipulator.manipulateAsync(
            uri,
            [
                { resize: { width: targetWidth } },
            ],
            {
                compress: 0.9,
                format: SaveFormat.JPEG,
            }
        );

        console.log('Image optimized:', result.uri);
        return result.uri;
    } catch (err) {
        console.error('Image optimization error:', err);
        return uri;
    }
};

export const optimizeImageBatch = async (
    uris: string[],
    targetWidth: number = 1920
): Promise<string[]> => {
    const optimizedUris: string[] = [];

    for (let i = 0; i < uris.length; i++) {
        try {
            const optimizedUri = await optimizeImage(uris[i], targetWidth);
            optimizedUris.push(optimizedUri);
            console.log(`Optimized ${i + 1}/${uris.length} images`);
        } catch (err) {
            console.error(`Error optimizing image ${i}:`, err);
            optimizedUris.push(uris[i]);
        }
    }

    console.log(`Batch optimization complete. Processed ${optimizedUris.length} images`);
    return optimizedUris;
};

export const cropImage = async (
    uri: string,
    cropArea: { originX: number; originY: number; width: number; height: number }
): Promise<string> => {
    try {
        const result = await ImageManipulator.manipulateAsync(
            uri,
            [
                {
                    crop: {
                        originX: cropArea.originX,
                        originY: cropArea.originY,
                        width: cropArea.width,
                        height: cropArea.height,
                    },
                },
            ],
            {
                compress: 1.0,
                format: SaveFormat.PNG,
            }
        );

        return result.uri;
    } catch (err) {
        console.error('Image crop error:', err);
        return uri;
    }
};

export const rotateImage = async (
    uri: string,
    degrees: 90 | 180 | 270
): Promise<string> => {
    try {
        const result = await ImageManipulator.manipulateAsync(
            uri,
            [
                { rotate: degrees },
            ],
            {
                compress: 1.0,
                format: SaveFormat.JPEG,
            }
        );

        return result.uri;
    } catch (err) {
        console.error('Image rotation error:', err);
        return uri;
    }
};

export const ImageQualityPresets = {
    HIGH: { width: 1920, compress: 0.95 },
    MEDIUM: { width: 1280, compress: 0.85 },
    LOW: { width: 854, compress: 0.7 },
} as const;

export const optimizeImageWithPreset = async (
    uri: string,
    preset: keyof typeof ImageQualityPresets = 'HIGH'
): Promise<string> => {
    try {
        const { width, compress } = ImageQualityPresets[preset];

        const result = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width } }],
            { compress, format: SaveFormat.JPEG }
        );

        return result.uri;
    } catch (err) {
        console.error('Image optimization with preset error:', err);
        return uri;
    }
};