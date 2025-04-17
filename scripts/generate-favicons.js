const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_IMAGE = path.resolve(__dirname, '../public/assets/images/logo-black.png');
const OUTPUT_DIR = path.resolve(__dirname, '../public/favicon');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Define favicon sizes to generate
const sizes = [16, 32, 48, 64, 72, 96, 128, 144, 152, 192, 256, 384, 512];

// Generate ICO file (favicon.ico) with 16x16, 32x32, and 48x48 sizes
async function generateFavicons() {
  try {
    // Generate favicon.ico (multi-size ICO file)
    await sharp(SOURCE_IMAGE).resize(32, 32).toFile(path.join(OUTPUT_DIR, 'favicon.ico'));

    console.log('Generated favicon.ico');

    // Generate PNG favicons in various sizes
    for (const size of sizes) {
      await sharp(SOURCE_IMAGE)
        .resize(size, size)
        .toFile(path.join(OUTPUT_DIR, `favicon-${size}x${size}.png`));

      console.log(`Generated favicon-${size}x${size}.png`);
    }

    // Generate Apple Touch Icon
    await sharp(SOURCE_IMAGE)
      .resize(180, 180)
      .toFile(path.join(OUTPUT_DIR, 'apple-touch-icon.png'));

    console.log('Generated apple-touch-icon.png');

    console.log('All favicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generateFavicons();
