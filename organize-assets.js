// Asset Organization and Background Removal Script
const fs = require('fs');
const path = require('path');

// Source and destination paths
const ASSETS_SOURCE = path.join(__dirname, 'assets');
const PUBLIC_ASSETS = path.join(__dirname, 'public', 'assets');

// Asset mapping: source filename → destination path
const ASSET_MAP = {
    // Backgrounds
    'back_left_under_text.png': 'images/backgrounds/back_left_under_text.png',
    'back_right_under_phone.png': 'images/backgrounds/back_right_under_phone.png',

    // Mascots
    'pedro_raccoon_phone.png': 'images/mascots/pedro_raccoon_phone.png',
    '1.1 Hero Section A cute cool raccoon character in a purple hoodie with cap is playfully popping out of a large modern smartphone screen.png': 'images/mascots/pedro_raccoon_phone.png',
    'Pedro_Thumbs_Up.png': 'images/mascots/pedro_thumbs_up.png',
    'Pedro_with_smartphone_in_one_hand.png': 'images/mascots/pedro_smartphone.png',
    'Pedro_Peeking.png': 'images/mascots/pedro_peeking.png',
    '1.3Pedro Hunting.png': 'images/mascots/pedro_hunting.png',

    // Logos
    'LOGO_white.png': 'images/logos/logo_white.png',
    '10.1_LOGO_MAIN.png': 'images/logos/logo_main.png',
    '10.2_icon.png': 'images/logos/logo_icon.png',
    '10.3_transparent.png': 'images/logos/logo_transparent.png',

    // Patterns
    'Seamless background pattern composed of small, simple outline icons_ discount tags, lightning bolts, pizza slices, smiles, and stars. Style_ Minimalist doodle art, line art. Color_ Very light purple lines on a whit.jpg': 'images/patterns/seamless_pattern.jpg',

    // Feature Icons (need background removal)
    'icon_search.png': 'icons/features/icon_search.png',
    'icon_wallet.png': 'icons/features/icon_wallet.png',
    'icon_qr.png': 'icons/features/icon_qr.png',

    // Category Icons (need background removal)
    '2.1 Ikona Pizza.png': 'icons/categories/icon_pizza.png',
    '2.2 Ikona Burger.png': 'icons/categories/icon_burger.png',
    '2.3 Ikona DrinkNapój.png': 'icons/categories/icon_drink.png',
    '2.4 Ikona Nożyczki (Fryzjer).png': 'icons/categories/icon_scissors.png',
    '2.5 Ikona Bilet Kinowy.png': 'icons/categories/icon_ticket.png',

    // Functional Icons (need background removal)
    '3.1 Checkmark (Ptaszek).png': 'icons/functional/icon_checkmark.png',
    '3.2 Strzałka w Prawo (Arrow Right).png': 'icons/functional/icon_arrow_right.png',
    '3.3 Strzałka w Dół (Scroll Indicator).png': 'icons/functional/icon_arrow_down.png',
    '3.4 Ikona Lokalizacji (Pin).png': 'icons/functional/icon_location.png',
    '3.5 Ikona Serca (LikeFavorite).png': 'icons/functional/icon_heart.png',
    '3.6 Ikona Dzwonka (Notifications).png': 'icons/functional/icon_bell.png',

    // Business Icons (need background removal)
    '4.1 Ikona Pieniędzy (MoneyRevenue).png': 'icons/business/icon_money.png',
    '4.2 Ikona Wykresu (Analytics).png': 'icons/business/icon_analytics.png',
    '4.3 Ikona Celu (Target).png': 'icons/business/icon_target.png',
    '4.4 Ikona Sklepu (Store).png': 'icons/business/icon_store.png',

    // Social Icons (need background removal)
    '5.1 Instagram Icon.png': 'icons/social/icon_instagram.png',
    '5.2 TikTok Icon.png': 'icons/social/icon_tiktok.png',
    '5.3 Facebook Icon.png': 'icons/social/icon_facebook.png',

    // Elements
    '6.1 Małe Ikony Pattern (Set).png': 'elements/pattern_icons.png',
    '6.2 KropkiParticles.png': 'elements/particles.png',
    '9.1 Speech Bubble (Dymek).png': 'elements/speech_bubble.png',
    '9.2 BadgePill Shape.png': 'elements/badge_pill.png',

    // Additional elements
    '7.3 Kupon Card (Przykładowa Karta).png': 'elements/kupon_card.png',
    '9.3 Hard Shadow Element (Szablon).png': 'elements/hard_shadow.png',
};

// Files that need background removal (all icons)
const NEEDS_BG_REMOVAL = [
    'icons/features/',
    'icons/categories/',
    'icons/functional/',
    'icons/business/',
    'icons/social/',
];

function shouldRemoveBackground(destPath) {
    return NEEDS_BG_REMOVAL.some(prefix => destPath.startsWith(prefix));
}

function ensureDirectoryExists(filePath) {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
}

function copyFile(source, dest) {
    ensureDirectoryExists(dest);
    fs.copyFileSync(source, dest);
    console.log(`✓ Copied: ${path.basename(source)} → ${dest.replace(PUBLIC_ASSETS, 'public/assets')}`);
}

async function main() {
    console.log('🚀 Starting Asset Organization...\n');

    // Check if source directory exists
    if (!fs.existsSync(ASSETS_SOURCE)) {
        console.error(`❌ Error: Source directory not found: ${ASSETS_SOURCE}`);
        process.exit(1);
    }

    // Create public/assets directory if it doesn't exist
    if (!fs.existsSync(PUBLIC_ASSETS)) {
        fs.mkdirSync(PUBLIC_ASSETS, { recursive: true });
    }

    let copied = 0;
    let needsBgRemoval = [];

    // Process each asset
    for (const [sourceName, destPath] of Object.entries(ASSET_MAP)) {
        const sourcePath = path.join(ASSETS_SOURCE, sourceName);
        const fullDestPath = path.join(PUBLIC_ASSETS, destPath);

        if (fs.existsSync(sourcePath)) {
            copyFile(sourcePath, fullDestPath);
            copied++;

            if (shouldRemoveBackground(destPath)) {
                needsBgRemoval.push(destPath);
            }
        } else {
            console.warn(`⚠ Warning: Source file not found: ${sourceName}`);
        }
    }

    console.log(`\n✅ Organization Complete!`);
    console.log(`   Copied: ${copied} files`);
    console.log(`   Need background removal: ${needsBgRemoval.length} files\n`);

    if (needsBgRemoval.length > 0) {
        console.log('📋 Files needing background removal:');
        needsBgRemoval.forEach(file => {
            console.log(`   - ${file}`);
        });
        console.log('\n⚠️  IMPORTANT: These icons need transparent backgrounds!');
        console.log('   You can:');
        console.log('   1. Use online tools like remove.bg');
        console.log('   2. Use image editors (Photoshop, GIMP, Figma)');
        console.log('   3. Run the background removal script (if sharp is installed)\n');
    }
}

main();
