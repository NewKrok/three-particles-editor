/**
 * Custom Sass compilation script for SMUI themes
 * Uses the modern Sass API to avoid deprecation warnings
 */

import fs from 'fs';
import path from 'path';
import * as sass from 'sass';

// Ensure the output directory exists
const ensureDirectoryExists = (dirPath) => {
  const dirname = path.dirname(dirPath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExists(dirname);
  fs.mkdirSync(dirname);
};

// Create a temporary SMUI theme file that imports all necessary components
const createTempSmuiFile = (themeFile, isDark) => {
  const tempDir = path.join(path.dirname(themeFile), 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const tempFile = path.join(tempDir, 'smui-theme-bundle.scss');

  // This is the key part - we need to create a file that imports the theme and all SMUI components
  const themeImportPath = isDark
    ? path.relative(tempDir, path.join(path.dirname(themeFile), 'dark', '_smui-theme.scss'))
    : path.relative(tempDir, themeFile);

  const content = `
// Import the theme
@use "${themeImportPath.replace(/\\/g, '/')}";

// Import all installed SMUI components with unique namespaces
@use "@smui/button/style" as button_style;
@use "@smui/card/style" as card_style;
@use "@smui/dialog/style" as dialog_style;
@use "@smui/paper/style" as paper_style;
@use "@smui/tab/style" as tab_style;
@use "@smui/tab-bar/style" as tab_bar_style;
@use "@smui/textfield/style" as textfield_style;
`;

  fs.writeFileSync(tempFile, content);
  return tempFile;
};

// Compile a Sass file to CSS
const compileTheme = (inputThemeDir, outputCssFile, isDark = false) => {
  // eslint-disable-next-line no-console
  console.log(`Compiling SMUI Theme${isDark ? ' (Dark)' : ''}...`);

  // Determine the input file path
  const themeFile = path.join(inputThemeDir, '_smui-theme.scss');

  // Create a temporary file that imports the theme and all SMUI components
  const tempFile = createTempSmuiFile(themeFile, isDark);

  try {
    // Compile Sass to CSS using the modern API
    const result = sass.compile(tempFile, {
      style: 'expanded',
      loadPaths: ['node_modules'],
    });

    // Ensure the output directory exists
    ensureDirectoryExists(outputCssFile);

    // Write the CSS to the output file
    fs.writeFileSync(outputCssFile, result.css);

    // eslint-disable-next-line no-console
    console.log(`Writing CSS to ${outputCssFile}...`);

    // Clean up the temporary file
    fs.unlinkSync(tempFile);
    try {
      fs.rmdirSync(path.dirname(tempFile));
    } catch {
      // Ignore if directory is not empty
    }
  } catch (error) {
    console.error('Error compiling Sass:', error);
    process.exit(1);
  }
};

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node compile-theme.js <output-css-file> <input-theme-dir> [--dark]');
  process.exit(1);
}

const outputCssFile = args[0];
const inputThemeDir = args[1];
const isDark = args.includes('--dark');

// Compile the theme
compileTheme(inputThemeDir, outputCssFile, isDark);
