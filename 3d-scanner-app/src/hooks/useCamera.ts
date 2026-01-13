import { useState, useRef, useEffect } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as FileSystem from 'expo-file-system';

export const useCamera = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [isRecording, setIsRecording] = useState(false);
    const [cameraType, setCameraType] = useState<CameraType>('back');
    const cameraRef = useRef<CameraView>(null);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

    const toggleCameraType = () => {
        setCameraType((current) => (current === 'back' ? 'front' : 'back'));
    };

    const startRecording = async (): Promise<string | null> => {
        if (!cameraRef.current || isRecording) {
            return null;
        };

        try {
            setIsRecording(true);
            setRecordingDuration(0);

            recordingTimerRef.current = setInterval(() => {
                setRecordingDuration((prev) => prev + 1);
            }, 1000);

            const video = await cameraRef.current.recordAsync({
                maxDuration: 60,
            });

            if (video && video.uri) {
                console.log('Video recorded:', video.uri);
                return video.uri;
            }

            return null;
        } catch (err) {
            console.error('Recording error:', err);
            setIsRecording(false);
            return null;
        }
    };

    const stopRecording = async (): Promise<void> => {
        if (!cameraRef.current || !isRecording) {
            return;
        }

        try {
            cameraRef.current.stopRecording();

            if (recordingTimerRef.current) {
                clearInterval(recordingTimerRef.current);
                recordingTimerRef.current = null;
            }

            setIsRecording(false);
            setRecordingDuration(0);
        } catch (err) {
            console.error('Stop recording error:', err);
        }
    };

    useEffect(() => {
        return () => {
            if (recordingTimerRef.current) {
                clearInterval(recordingTimerRef.current);
            }
        };
    }, []);

    return {
        permission,
        requestPermission,

        isRecording,
        startRecording,
        stopRecording,
        recordingDuration,

        cameraRef,
        cameraType,
        toggleCameraType,
    };
};