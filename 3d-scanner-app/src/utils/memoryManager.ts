import * as FileSystem from "expo-file-system";
  import { useEffect, useRef } from "react";

  // ==================== Types ====================
  interface CleanupTask {
    id: string;
    cleanup: () => Promise<void>;
    priority: number;
  }

  // ==================== Memory Manager Class ====================
  class MemoryManager {
    private cleanupTasks: Map<string, CleanupTask> = new Map();
    private tempFiles: Set<string> = new Set();

    registerCleanup(
      id: string,
      cleanup: () => Promise<void>,
      priority: number = 2
    ): void {
      this.cleanupTasks.set(id, { id, cleanup, priority });
      console.log(`[MemoryManager] Registered cleanup: ${id}`);
    }

    unregisterCleanup(id: string): void {
      this.cleanupTasks.delete(id);
    }

    trackTempFile(filePath: string): void {
      this.tempFiles.add(filePath);
    }

    untrackTempFile(filePath: string): void {
      this.tempFiles.delete(filePath);
    }

    async runCleanup(): Promise<void> {
      console.log("[MemoryManager] Running cleanup...");

      const sortedTasks = Array.from(this.cleanupTasks.values()).sort(
        (a, b) => a.priority - b.priority
      );

      for (const task of sortedTasks) {
        try {
          await task.cleanup();
          console.log(`[MemoryManager] Cleanup completed: ${task.id}`);
        } catch (error) {
          console.error(`[MemoryManager] Cleanup failed: ${task.id}`, error);
        }
      }

      await this.cleanTempFiles();
    }

    async cleanTempFiles(): Promise<void> {
      for (const filePath of this.tempFiles) {
        try {
          const fileInfo = await FileSystem.getInfoAsync(filePath);
          if (fileInfo.exists) {
            await FileSystem.deleteAsync(filePath, { idempotent: true });
          }
        } catch (error) {
          console.error(`[MemoryManager] Failed to delete: ${filePath}`, error);
        }
      }
      this.tempFiles.clear();
    }

    getStats(): { cleanupTasks: number; tempFiles: number } {
      return {
        cleanupTasks: this.cleanupTasks.size,
        tempFiles: this.tempFiles.size,
      };
    }
  }

  export const memoryManager = new MemoryManager();

  // ==================== Cleanup Hooks ====================
  export const useCleanup = (
    cleanupFn: () => void | Promise<void>,
    deps: React.DependencyList = []
  ): void => {
    const cleanupRef = useRef(cleanupFn);
    cleanupRef.current = cleanupFn;

    useEffect(() => {
      return () => {
        const cleanup = cleanupRef.current;
        if (cleanup) {
          Promise.resolve(cleanup()).catch((error) => {
            console.error("[useCleanup] Error:", error);
          });
        }
      };
    }, deps);
  };

  export const useTempFile = (filePath: string | null): void => {
    useEffect(() => {
      if (filePath) {
        memoryManager.trackTempFile(filePath);

        return () => {
          FileSystem.deleteAsync(filePath, { idempotent: true })
            .then(() => memoryManager.untrackTempFile(filePath))
            .catch((error) => console.error(`[useTempFile] Cleanup failed:`, error));
        };
      }
    }, [filePath]);
  };

  // ==================== File Cleanup Utilities ====================
  export const cleanupFrameFiles = async (frameUris: string[]): Promise<void> => {
    console.log(`[Cleanup] Deleting ${frameUris.length} frame files...`);

    let deletedCount = 0;

    for (const uri of frameUris) {
      try {
        await FileSystem.deleteAsync(uri, { idempotent: true });
        deletedCount++;
      } catch (error) {
        console.error(`[Cleanup] Failed to delete frame: ${uri}`);
      }
    }

    console.log(`[Cleanup] Frames cleanup complete: ${deletedCount} deleted`);
  };

  export const cleanupVideoFile = async (videoPath: string): Promise<void> => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(videoPath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(videoPath, { idempotent: true });
        console.log(`[Cleanup] Video deleted: ${videoPath}`);
      }
    } catch (error) {
      console.error(`[Cleanup] Failed to delete video: ${videoPath}`, error);
    }
  };