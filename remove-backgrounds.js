// Background Removal Script using Sharp
// This script removes backgrounds from icon PNG files
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

async function removeBackground(inputPath, outputPath) {
    try {
        // Read the image
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        // Get image buffer with alpha channel
        const { data, info } = await image
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        // Process pixels to remove white/light backgrounds
        // This is a simple threshold-based approach
        const pixelArray = new Uint8ClampedArray(data);
        const threshold = 240; // Adjust this to be more/less aggressive

        for (let i = 0; i < pixelArray.length; i += info.channels) {
            const r = pixelArray[i];
            const g = pixelArray[i + 1];
            const b = pixelArray[i + 2];

            // If pixel is close to white/light gray, make it transparent
            if (r > threshold && g > threshold && b > threshold) {
                pixelArray[i + 3] = 0; // Set alpha to 0 (transparent)
            }
            // Also check for specific background colors if needed
            // You can add more conditions here
        }

        // Create output image with transparent background
        await sharp(pixelArray, {
            raw: {
                width: info.width,
                height: info.height,
                channels: info.channels
            }
        })
            .png()
            .toFile(outputPath);

        console.log(`✓ Processed: ${path.basename(inputPath)}`);
        return true;
    } catch (error) {
        console.error(`✗ Error processing ${path.basename(inputPath)}:`, error.message);
        return false;
    }
}

async function processDirectory(dirPath) {
    const fullPath = path.join(PUBLIC_ASSETS, dirPath);

    if (!fs.existsSync(fullPath)) {
        console.warn(`⚠ Directory not found: ${dirPath}`);
        return 0;
    }

    const files = fs.readdirSync(fullPath);
    const pngFiles = files.filter(f => f.endsWith('.png'));

    console.log(`\n📁 Processing ${dirPath}/ (${pngFiles.length} files)`);

    let processed = 0;
    for (const file of pngFiles) {
        const inputPath = path.join(fullPath, file);
        // Create backup
        const backupPath = path.join(fullPath, file.replace('.png', '_original.png'));

        // Backup original if not already backed up
        if (!fs.existsSync(backupPath)) {
            fs.copyFileSync(inputPath, backupPath);
        }

        const success = await removeBackground(inputPath, inputPath);
        if (success) processed++;
    }

    return processed;
}

async function main() {
    console.log('🎨 Starting Background Removal for Icons...\n');
    console.log('This will remove white/light backgrounds from all icon files.');
    console.log('Original files will be backed up with "_original.png" suffix.\n');

    let totalProcessed = 0;

    for (const dir of ICON_DIRS) {
        const count = await processDirectory(dir);
        totalProcessed += count;
    }

    console.log(`\n✅ Background Removal Complete!`);
    console.log(`   Total processed: ${totalProcessed} files`);
    console.log(`\n💡 Tips:`);
    console.log(`   - Check the icons in a browser or image viewer`);
    console.log(`   - If transparency isn't perfect, you may need to:`);
    console.log(`     • Adjust the threshold value in the script`);
    console.log(`     • Use a more advanced tool like remove.bg`);
    console.log(`     • Manually edit in Photoshop/GIMP`);
    console.log(`   - Original files are saved as *_original.png\n`);
}

main();
