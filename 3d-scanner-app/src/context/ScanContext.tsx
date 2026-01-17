import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Model3D } from "../types/model.types";

interface ScanState {
  isScanning: boolean;
  currentFrameCount: number;
  videoPath: string | null;
  processingProgress: number;
  processingStatus: string;
  currentModel: Model3D | null;
  error: string | null;
}

interface ScanContextValue extends ScanState {
  startScanning: () => void;
  stopScanning: (videoPath: string) => void;
  updateFrameCount: (count: number) => void;
  setProcessingProgress: (progress: number, status?: string) => void;
  setCurrentModel: (model: Model3D | null) => void;
  setError: (error: string | null) => void;
  resetScan: () => void;
}

const initialState: ScanState = {
  isScanning: false,
  currentFrameCount: 0,
  videoPath: null,
  processingProgress: 0,
  processingStatus: "",
  currentModel: null,
  error: null,
};

const ScanContext = createContext<ScanContextValue | undefined>(undefined);

interface ScanProviderProps {
  children: ReactNode;
}

export const ScanProvider: React.FC<ScanProviderProps> = ({ children }) => {
  const [state, setState] = useState<ScanState>(initialState);

  const startScanning = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isScanning: true,
      currentFrameCount: 0,
      videoPath: null,
      error: null,
    }));
    console.log("Scanning started");
  }, []);

  const stopScanning = useCallback((videoPath: string) => {
    setState((prev) => ({
      ...prev,
      isScanning: false,
      videoPath,
    }));
    console.log("Scanning stopped, video:", videoPath);
  }, []);

  const updateFrameCount = useCallback((count: number) => {
    setState((prev) => ({
      ...prev,
      currentFrameCount: count,
    }));
  }, []);

  const setProcessingProgress = useCallback(
    (progress: number, status?: string) => {
      setState((prev) => ({
        ...prev,
        processingProgress: progress,
        processingStatus: status || prev.processingStatus,
      }));
    },
    []
  );

  const setCurrentModel = useCallback((model: Model3D | null) => {
    setState((prev) => ({
      ...prev,
      currentModel: model,
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({
      ...prev,
      error,
    }));
  }, []);

  const resetScan = useCallback(() => {
    setState(initialState);
    console.log("Scan state reset");
  }, []);

  const value: ScanContextValue = {
    ...state,
    startScanning,
    stopScanning,
    updateFrameCount,
    setProcessingProgress,
    setCurrentModel,
    setError,
    resetScan,
  };

  return (
    <ScanContext.Provider value={value}>
        {children}
    </ScanContext.Provider>
  )
};

export const useScan = (): ScanContextValue => {
    const context = useContext(ScanContext);

    if (context === undefined) {
        throw new Error('useScan must be used within a ScanProvider');
    }

    return context;
};

export { ScanContext };
