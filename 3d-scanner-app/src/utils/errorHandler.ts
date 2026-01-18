import { Alert } from 'react-native';

export type ErrorType = 
  | "PERMISSION_DENIED"
  | "CAMERA_ERROR"
  | "STORAGE_ERROR"
  | "NETWORK_ERROR"
  | "PROCESSING_ERROR"
  | "EXPORT_ERROR"
  | "VALIDATION_ERROR"
  | "UNKNOWN_ERROR";

export interface AppError {
    type: ErrorType;
    message: string;
    originalError?: Error;
    userMessage: string;
}

const ERROR_MESSAGES: Record<ErrorType, { title: string; message: string }> ={
    PERMISSION_DENIED: {
      title: "წვდომა უარყოფილია",
      message: "გთხოვთ, მიანიჭოთ აპლიკაციას საჭირო უფლებები პარამეტრებიდან.",
    },
    CAMERA_ERROR: {
      title: "კამერის შეცდომა",
      message: "კამერასთან დაკავშირება ვერ მოხერხდა. სცადეთ თავიდან.",
    },
    STORAGE_ERROR: {
      title: "შენახვის შეცდომა",
      message: "მონაცემების შენახვა ვერ მოხერხდა. შეამოწმეთ თავისუფალი ადგილი.",
    },
    NETWORK_ERROR: {
      title: "კავშირის შეცდომა",
      message: "ინტერნეტთან კავშირი ვერ მოხერხდა. შეამოწმეთ კავშირი.",
    },
    PROCESSING_ERROR: {
      title: "დამუშავების შეცდომა",
      message: "ვიდეოს დამუშავება ვერ მოხერხდა. სცადეთ თავიდან.",
    },
    EXPORT_ERROR: {
      title: "ექსპორტის შეცდომა",
      message: "მოდელის ექსპორტი ვერ მოხერხდა.",
    },
    VALIDATION_ERROR: {
      title: "ვალიდაციის შეცდომა",
      message: "შეყვანილი მონაცემები არასწორია.",
    },
    UNKNOWN_ERROR: {
      title: "შეცდომა",
      message: "დაფიქსირდა მოულოდნელი შეცდომა. სცადეთ თავიდან.",
    },
};

export const createAppError = (
    type: ErrorType,
    originalError?: Error,
    customMessage?: string
): AppError => {
    const errorInfo = ERROR_MESSAGES[type];

    return {
        type,
        message: originalError?.message || errorInfo.message,
        originalError,
        userMessage: customMessage || errorInfo.message,
    };
};

export const showErrorAlert = (
    error: AppError | ErrorType,
    onRetry?: () => void,
    onCancel?: () => void
): void => {
    const errorInfo = typeof error === 'string'
      ? ERROR_MESSAGES[error]
      : ERROR_MESSAGES[error.type];

    const userMessage = typeof error === 'string'
      ? errorInfo.message
      : error.userMessage;
    
    const buttons: any[] = [
        {
            text: "დახურვა",
            style: "cancel",
            onPress: onCancel,
        },
    ];

    if (onRetry) {
        buttons.push({
            text: "თავიდან ცდა",
            onPress: onRetry,
        });
    }

    Alert.alert(errorInfo.title, userMessage, buttons);
};

export const handleAsyncError = async <T>(
    asyncFn: () => Promise<T>,
    errorType: ErrorType,
    options?: {
        showAlert?: boolean;
        onRetry?: () => void;
        customMessage?: string;
    }
): Promise<{ data: T | null; error: AppError | null }> => {
    try {
        const data = await asyncFn();
        return { data, error: null };
    } catch (err) {
        const error = createAppError(
            errorType,
            err instanceof Error ? err: undefined,
            options?.customMessage
        );

        console.error(`[${errorType}]:`, err);

        if (options?.showAlert !== false) {
            showErrorAlert(error, options?.onRetry);
        }

        return { data: null, error };
    }
};

export const validateVideoPath = (path: string | null | undefined): boolean => {
    if (!path) return false;
    if (typeof path !== 'string') return false;
    if (path.trim().length === 0) return false;

    return true;
};

export const validateModelName = (name: string): { valid: boolean; error?: string } => {
    if (!name || name.trim().length === 0) {
        return { valid: false, error: 'სახელი აუცილებელია'};
    }
    if (name.length > 50) {
        return { valid: false, error: 'სახელი არ უნდა აღემატებოდეს 50 სიმბოლოს'};
    }
    if (/[<>:"/\\|?*]/.test(name)) {
        return { valid: false, error: 'სახელი შეიცავს აკრძალულ სიმბოლოებს'};
    }
    return { valid: true };
}

export const validateFrameCount = (count: number, min: number, max: number): boolean => {
    return count >= min && count <= max;
}

export const validatePermissionError = (
    permissionType: "camera" | "storage" | "microphone",
    onOpenSettings?: () => void
): void => {
    const messages: Record<string, string> ={
        camera: 'ლამერის გამოსაყნებლად საჭიროა წვდომის მინიჭება.',
        storage: 'შენახვის ადგილამდე წვდომის მინიჭებაა საჭირო.',
        microphone: 'მიკროფონის გამოსაყენებლად საჭიროა წვდომის მინიჭება.',
    };

    Alert.alert(
        "წვდომა საჭიროა",
        messages[permissionType],
        [
            { text: 'გაუქმება', style: 'cancel' },
            ...(onOpenSettings
                  ? [{ text: 'პარამეტრები', onPress: onOpenSettings } ]
                  : []),
        ]
    )
};

export const logError = (
    context: string,
    error: unknown,
    additionalInfo?: Record<string, any>
): void => {
    console.error(`[ERROR - ${context}]:`, {
        error,
        timestamp: new Date().toISOString(),
        ...additionalInfo,
    });
};