import { writable } from 'svelte/store';

/**
 * Type definitions for snackbar messages
 */
type SnackbarType = 'default' | 'success' | 'error' | 'warning' | 'info';

interface SnackbarMessage {
  message: string;
  timeout: number;
  type: SnackbarType;
}

/**
 * Store for snackbar messages
 */
export const snackbarStore = writable<SnackbarMessage | null>(null);

/**
 * Show a snackbar message
 */
export const showSnackbar = (
  message: string,
  timeout = 3000,
  type: SnackbarType = 'default'
): void => {
  snackbarStore.set({ message, timeout, type });
};

/**
 * Show a success snackbar message
 */
export const showSuccessSnackbar = (message: string, timeout = 3000): void => {
  showSnackbar(message, timeout, 'success');
};

/**
 * Show an error snackbar message
 */
export const showErrorSnackbar = (message: string, timeout = 3000): void => {
  showSnackbar(message, timeout, 'error');
};

/**
 * Show a warning snackbar message
 */
export const showWarningSnackbar = (message: string, timeout = 3000): void => {
  showSnackbar(message, timeout, 'warning');
};

/**
 * Show an info snackbar message
 */
export const showInfoSnackbar = (message: string, timeout = 3000): void => {
  showSnackbar(message, timeout, 'info');
};
