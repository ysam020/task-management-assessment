import { useCallback } from "react";
import toast from "react-hot-toast";

interface ToastOptions {
  duration?: number;
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
}

export function useToast() {
  const showSuccess = useCallback((message: string, options?: ToastOptions) => {
    toast.success(message, options);
  }, []);

  const showError = useCallback((message: string, options?: ToastOptions) => {
    toast.error(message, options);
  }, []);

  const showInfo = useCallback((message: string, options?: ToastOptions) => {
    toast(message, options);
  }, []);

  const showLoading = useCallback((message: string) => {
    return toast.loading(message);
  }, []);

  const showPromise = useCallback(
    <T>(
      promise: Promise<T>,
      messages: {
        loading: string;
        success: string;
        error: string;
      }
    ) => {
      return toast.promise(promise, messages);
    },
    []
  );

  const dismiss = useCallback((toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  }, []);

  const dismissAll = useCallback(() => {
    toast.dismiss();
  }, []);

  return {
    success: showSuccess,
    error: showError,
    info: showInfo,
    loading: showLoading,
    promise: showPromise,
    dismiss,
    dismissAll,
  };
}
