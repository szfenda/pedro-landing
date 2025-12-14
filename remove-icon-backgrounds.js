// Universal script to remove RGB(175,175,175) backgrounds from remaining icons
// Based on successful method used for Pedro mascots
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_ASSETS = path.join(__dirname, 'public', 'assets');

// Icon directories that need background removal
const ICON_DIRS = [
    'icons/features',      // 3 files - CRITICAL for Features section
    'icons/categories',    // 5 files - Background doodles
    'icons/functional',    // 6 files - UI elements
    'icons/business',      // 4 files - B2B orbiting icons
    'icons/social',        // 3 files - Footer social links
];

async function removeIconBackground(inputPath, outputPath) {
    try {
        console.log(`🎯 Processing: ${path.basename(inputPath)}`);

        // Create backup
        const backupPath = inputPath.replace('.png', '_backup.png');
        if (!fs.existsSync(backupPath)) {
            fs.copyFileSync(inputPath, backupPath);
        }

        const image = sharp(inputPath);
        const metadata = await image.metadata();

        const { data, info } = await image
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const pixelArray = new Uint8ClampedArray(data);
        let pixelsChanged = 0;

        // Precise RGB(175,175,175) removal - proven method
        const targetR = 175;
        const targetG = 175;
        const targetB = 175;
        const tolerance = 5;

        for (let i = 0; i < pixelArray.length; i += 4) { // RGBA
            const r = pixelArray[i];
            const g = pixelArray[i + 1];
            const b = pixelArray[i + 2];

            if (Math.abs(r - targetR) <= tolerance && 
                Math.abs(g - targetG) <= tolerance && 
                Math.abs(b - targetB) <= tolerance) {
                
                pixelArray[i + 3] = 0; // Set alpha to 0 (transparent)
                pixelsChanged++;
            }
        }

        await sharp(pixelArray, {
            raw: {
                width: info.width,
                height: info.height,
                channels: 4
            }
        })
            .png({ compressionLevel: 9 })
            .toFile(outputPath);

        console.log(`✅ ${path.basename(inputPath)}: ${pixelsChanged} pixels processed`);
        return pixelsChanged;

    } catch (error) {
        console.error(`❌ Error processing ${path.basename(inputPath)}: ${error.message}`);
        return 0;
    }
}

async function processIconDirectory(dirPath) {
    const fullPath = path.join(PUBLIC_ASSETS, dirPath);

    if (!fs.existsSync(fullPath)) {
        console.warn(`⚠️  Directory not found: ${dirPath}`);
        return 0;
    }

    const files = fs.readdirSync(fullPath);
    const pngFiles = files.filter(f => f.endsWith('.png') && !f.includes('_backup') && !f.includes('_original'));

    console.log(`\n📁 Processing ${dirPath}/ (${pngFiles.length} files)`);

    let totalPixelsProcessed = 0;
    for (const file of pngFiles) {
        const inputPath = path.join(fullPath, file);
        const pixelsProcessed = await removeIconBackground(inputPath, inputPath);
        totalPixelsProcessed += pixelsProcessed;
    }

    return totalPixelsProcessed;
}

async function main() {
    console.log('🚀 Universal Icon Background Removal');
    console.log('Using proven RGB(175,175,175) removal method\n');

    let totalPixelsProcessed = 0;
    let totalFilesProcessed = 0;

    for (const dir of ICON_DIRS) {
        const pixelsProcessed = await processIconDirectory(dir);
        totalPixelsProcessed += pixelsProcessed;
        
        const fullPath = path.join(PUBLIC_ASSETS, dir);
        if (fs.existsSync(fullPath)) {
            const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.png') && !f.includes('_backup'));
            totalFilesProcessed += files.length;
        }
    }

    console.log(`\n🎉 COMPLETE!`);
    console.log(`📊 Files processed: ${totalFilesProcessed}`);
    console.log(`🎨 Total pixels processed: ${totalPixelsProcessed.toLocaleString()}`);
    console.log(`🔄 Refresh browser with Ctrl+Shift+R to see changes\n`);
}

main();