// IMPROVED Background Removal Script with better algorithm
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_ASSETS = path.join(__dirname, 'public', 'assets');

// Directories containing icons that need background removal
const ICON_DIRS = [
    'icons/features',
    'icons/categories',
    'icons/functional',
    'icons/business',
    'icons/social',
];

async function removeBackgroundAdvanced(inputPath, outputPath) {
    try {
        console.log(`Processing: ${path.basename(inputPath)}`);

        const image = sharp(inputPath);
        const metadata = await image.metadata();

        const { data, info } = await image
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const pixelArray = new Uint8ClampedArray(data);

        // More aggressive - remove all light colors
        const threshold = 220;
        const tolerance = 40;

        for (let i = 0; i < pixelArray.length; i += info.channels) {
            const r = pixelArray[i];
            const g = pixelArray[i + 1];
            const b = pixelArray[i + 2];

            // Remove white and light colors
            if (r > threshold && g > threshold && b > threshold) {
                pixelArray[i + 3] = 0;
            }

            // Remove colors where RGB values are similar (grays, beiges)
            const colorDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
            if (colorDiff < tolerance && r > threshold) {
                pixelArray[i + 3] = 0;
            }
        }

        await sharp(pixelArray, {
            raw: {
                width: info.width,
                height: info.height,
                channels: info.channels
            }
        })
            .png({ compressionLevel: 9 })
            .toFile(outputPath);

        console.log(`✓ Done: ${path.basename(inputPath)}`);
        return true;
    } catch (error) {
        console.error(`✗ Error: ${path.basename(inputPath)} - ${error.message}`);
        return false;
    }
}

async function processDirectory(dirPath) {
    const fullPath = path.join(PUBLIC_ASSETS, dirPath);

    if (!fs.existsSync(fullPath)) {
        console.warn(`Directory not found: ${dirPath}`);
        return 0;
    }

    const files = fs.readdirSync(fullPath);
    const pngFiles = files.filter(f => f.endsWith('.png') && !f.includes('_original') && !f.includes('_backup'));

    console.log(`\nProcessing ${dirPath}/ (${pngFiles.length} files)`);

    let processed = 0;
    for (const file of pngFiles) {
        const inputPath = path.join(fullPath, file);
        const backupPath = path.join(fullPath, file.replace('.png', '_backup.png'));

        if (!fs.existsSync(backupPath)) {
            fs.copyFileSync(inputPath, backupPath);
        }

        const success = await removeBackgroundAdvanced(inputPath, inputPath);
        if (success) processed++;
    }

    return processed;
}

async function main() {
    console.log('Improved Background Removal Script');
    console.log('Using aggressive threshold to remove all backgrounds\n');

    let totalProcessed = 0;

    for (const dir of ICON_DIRS) {
        const count = await processDirectory(dir);
        totalProcessed += count;
    }

    console.log(`\nComplete! Processed ${totalProcessed} files`);
    console.log('Refresh browser with Ctrl+Shift+R to see changes\n');
}

main();
