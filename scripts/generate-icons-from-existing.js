const sharp = require('sharp');
const path = require('path');

const sourcePath = path.join(__dirname, '../public/android-chrome-192x192.png');
const publicDir = path.join(__dirname, '../public');

async function generateIcons() {
  console.log('Generating icons from android-chrome-192x192.png...\n');

  // Read source image
  const sourceImage = sharp(sourcePath);

  // Generate 192x192 icon (PWA standard)
  await sourceImage
    .clone()
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));
  console.log('✓ Generated icon-192.png (192x192)');

  // Generate 512x512 icon (PWA standard)
  await sourceImage
    .clone()
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('✓ Generated icon-512.png (512x512)');

  // Generate apple-touch-icon (180x180)
  await sourceImage
    .clone()
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✓ Generated apple-touch-icon.png (180x180)');

  // Generate favicon-32x32
  await sourceImage
    .clone()
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log('✓ Generated favicon-32x32.png (32x32)');

  // Generate favicon-16x16
  await sourceImage
    .clone()
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));
  console.log('✓ Generated favicon-16x16.png (16x16)');

  console.log('\n✅ All PWA icons regenerated successfully from android-chrome-192x192.png!');
}

generateIcons().catch(console.error);
