import * as VideoThumbnails from 'expo-video-thumbnails';
import * as FileSystem from 'expo-file-system';
import { SCAN_CONFIG } from '../constants';

export const extractFramesFromVideo = async (
    videoUri: string,
    frameCount: number = SCAN_CONFIG.RECOMMENDED_FRAMES
): Promise<string[]> => {
    try {
        console.log('Starting frame extraction from:', videoUri);
        console.log('Target frame count:', frameCount);

        if (frameCount < SCAN_CONFIG.MIN_FRAMES) {
            frameCount = SCAN_CONFIG.MIN_FRAMES;
        }
        if (frameCount > SCAN_CONFIG.MAX_FRAMES) {
            frameCount = SCAN_CONFIG.MAX_FRAMES;
        }

        const videoInfo = await FileSystem.getInfoAsync(videoUri);
        if (!videoInfo.exists) {
            throw new Error('Video file not found');
        }

        const estimatedDuration = 60000;

        const timestamps = calculateTimestamps(estimatedDuration, frameCount);

        console.log('Calculated timestamps:', timestamps.length);

        const frameUris: string[] = [];

        for (let i = 0; i < timestamps.length; i++) {
            try {
                const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
                    time: timestamps[i],
                    quality: 1.0,
                });

                frameUris.push(uri);
                console.log(`Frame ${i + 1}/${timestamps.length} extracted`);
            } catch (err) {
                console.error(`Error extraction frame at ${timestamps[i]}ms:`, err);
                // Continue with next frame
            }
        }

        console.log(`Frame extraction complete. Extracted ${frameUris.length} frames`);
        return frameUris;
    } catch (err) {
        console.error('Frame extraction error:', err);
        throw new Error('Failed to extract frames from video');
    }
};

const calculateTimestamps = (duration: number, frameCount: number): number[] => {
    const timestamps: number[] = [];

    if (duration < 1000) {
        return [500];
    }

    const interval = duration / frameCount;

    for (let i = 0; i < frameCount; i++) {
        const timestamp = Math.floor(i * interval);
        timestamps.push(timestamp);
    }

    return timestamps;
}

export const cleanupFrames = async (frameUris: string[]): Promise<void> => {
    try {
        for (const uri of frameUris) {
            await FileSystem.deleteAsync(uri, { idempotent: true });
        }
        console.log(`Cleaned up ${frameUris.length} frames`);
    } catch (err) {
        console.error('Cleanup error:', err);
    }
};

export const cleanupVideo = async (videoUri: string): Promise<void> => {
    try {
        await FileSystem.deleteAsync(videoUri, { idempotent: true });
        console.log('Video cleaned up:', videoUri);
    } catch (err) {
        console.error('Video cleanup error:', err);
    }
};