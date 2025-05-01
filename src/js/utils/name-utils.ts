/**
 * Utility functions for name generation and management
 */

/**
 * Type definition for saved configuration with name property
 */
type ConfigWithName = {
  name?: string;
};

/**
 * Converts a string to a URL-friendly format by removing special characters and replacing spaces with hyphens
 * @param {string} str - The string to convert
 * @returns {string} The URL-friendly string
 */
export const toUrlFriendlyString = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * Generate a default name in the format "Untitled-X" where X is the next available number
 * @returns {string} Generated name in the format "Untitled-X"
 */
export const generateDefaultName = (): string => {
  try {
    // Get existing configs to find the next available number
    const savedConfigsStr = localStorage.getItem('three-particles-saved-configs');
    const savedConfigs = savedConfigsStr ? (JSON.parse(savedConfigsStr) as ConfigWithName[]) : [];

    // Find the highest Untitled-X number
    let maxNumber = 0;
    savedConfigs.forEach((config: ConfigWithName) => {
      const match = config.name?.match(/^Untitled-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNumber) maxNumber = num;
      }
    });

    // Create new name with incremented number
    return `Untitled-${maxNumber + 1}`;
  } catch {
    // Fallback to Untitled-1 if there's an error
    return 'Untitled-1';
  }
};
