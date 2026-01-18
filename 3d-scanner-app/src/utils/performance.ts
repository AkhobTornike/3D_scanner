import { resolve } from "@react-three/fiber/dist/declarations/src/core/utils";
import { useCallback, useRef, useEffect } from "react";

export const useDebounce = <T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): T => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return useCallback(
        ((...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        }) as T,
        [callback, delay]
    );
};

export const useThrottle = <T extends (...args: any[]) => any>(
    callback: T,
    limit: number
): T => {
    const lastRun = useRef<number>(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return useCallback(
        ((...args: Parameters<T>) => {
            const now = Date.now();

            if (now - lastRun.current >= limit) {
                lastRun.current = now;
                callback(...args);
            } else {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                timeoutRef.current = setTimeout(() => {
                    lastRun.current = Date.now();
                    callback(...args);
                }, limit - (now - lastRun.current));
            }
        }) as T,
        [callback, limit]
    );
};

export const usePrevous = <T>(value: T): T | undefined => {
    const ref = useRef<T>(undefined);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
};

export const useIsMounted = (): (() => boolean) => {
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    return useCallback(() => isMounted.current, []);
};

export const useAsyncEffect = (
    asyncFn: () => Promise<void>,
    deps: React.DependencyList
): void => {
    const isMounted = useIsMounted();

    useEffect(() => {
        const runAsync = async () => {
            try {
                await asyncFn();
            } catch (err) {
                if (isMounted()) {
                    console.error("useAsyncEffect error:", err);
                }
            }
        };

        runAsync();
    }, deps);
};

export const measurePerformance = async <T>(
    label: string,
    fn: () => Promise<T>
): Promise<T> => {
    const start = performance.now();

    try {
        const result = await fn();
        const end = performance.now();
        console.log(`[PREF] ${label}: ${(end - start).toFixed(2)}ms`);
        return result;
    } catch (err) {
        const end = performance.now();
        console.log(`[PREF] ${label} (failed): ${(end - start).toFixed(2)}ms`);
        throw err;
    }
};

export const batchUpdates = <T>(
    items: T[],
    batchSize: number,
    onBatch: (batch: T[], batchIndex: number) => void,
    delayMs: number = 0
): Promise<void> => {
    return new Promise((resolve) => {
        let currentIndex = 0;

        const processBatch = () => {
            const batch = items.slice(currentIndex, currentIndex + batchSize);
            const batchIndex = Math.floor(currentIndex / batchSize);

            if (batch.length > 0) {
                resolve();
                return;
            }

            onBatch(batch, batchIndex);
            currentIndex += batchSize;

            if (currentIndex < items.length) {
                if (delayMs > 0) {
                    setTimeout(processBatch, delayMs);
                } else {
                    requestAnimationFrame(processBatch);
                }
            } else {
                resolve();
            }
        };

        processBatch();
    })
}