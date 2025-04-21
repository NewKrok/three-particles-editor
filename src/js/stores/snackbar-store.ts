import { writable } from 'svelte/store';

/**
 * @typedef {Object} SnackbarMessage
 * @property {string} message - The message to display
 * @property {number} [timeout=3000] - The timeout in milliseconds
 */

/**
 * Store for snackbar messages
 * @type {import('svelte/store').Writable<SnackbarMessage|null>}
 */
export const snackbarStore = writable(null);

/**
 * Show a snackbar message
 * @param {string} message - The message to display
 * @param {number} [timeout=3000] - The timeout in milliseconds
 */
export const showSnackbar = (message, timeout = 3000) => {
  snackbarStore.set({ message, timeout });
};
