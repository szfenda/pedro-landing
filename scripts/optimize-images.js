/**
 * T-083: lekkie wersje WebP grafik landingu (oryginały PNG zostają obok).
 * Szerokość = ok. 2× (retina) największego wyświetlanego rozmiaru.
 * Uruchom: node scripts/optimize-images.js   (po podmianie PNG — wygeneruj ponownie)
 */
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const PUBLIC = path.join(__dirname, '..', 'public')

// [ścieżka PNG/JPG w public, szerokość docelowa (null = bez zmiany), jakość (domyślnie 82)]
const ICON = 256 // ikony wyświetlane max 120 px
const FILES = [
    // tło Hero (cover na pół ekranu) — rozmiar oryginału
    ['/assets/images/backgrounds/back_left_under_text.png', null],
    ['/assets/images/backgrounds/back_right_under_phone.png', null],
    // maskotki
    ['/assets/images/mascots/pedro_raccoon_phone.png', null], // Hero 500×600 (desktop)
    ['/assets/images/mascots/pedro_thumbs_up.png', 900], // max-w-md (448 px)
    ['/assets/images/mascots/pedro_hunting.png', 900], // max-w-md (448 px)
    ['/assets/images/mascots/pedro_smartphone.png', 400], // 200 px
    ['/assets/images/mascots/pedro_peeking.png', 240], // 120 px
    // logo w menu (wysokość 40 px)
    ['/assets/images/logos/logo_main.png', 400, 95], // cienkie kontury → wyższa jakość
    // ikony
    ...[
        'features/icon_search', 'features/icon_wallet', 'features/icon_qr',
        'categories/icon_pizza', 'categories/icon_burger', 'categories/icon_drink',
        'categories/icon_scissors', 'categories/icon_ticket',
        'functional/icon_checkmark', 'functional/icon_arrow_right', 'functional/icon_arrow_down',
        'functional/icon_location', 'functional/icon_heart', 'functional/icon_bell',
        'business/icon_money', 'business/icon_analytics', 'business/icon_target', 'business/icon_store',
        'social/icon_instagram', 'social/icon_tiktok', 'social/icon_facebook',
    ].map((n) => [`/assets/icons/${n}.png`, ICON]),
]

async function main() {
    let before = 0
    let after = 0
    for (const [rel, width, quality = 82] of FILES) {
        const src = path.join(PUBLIC, rel)
        const dst = src.replace(/\.(png|jpe?g)$/i, '.webp')
        let img = sharp(src)
        if (width) img = img.resize({ width, withoutEnlargement: true })
        await img.webp({ quality, alphaQuality: 100, effort: 6 }).toFile(dst)
        const a = fs.statSync(src).size
        const b = fs.statSync(dst).size
        before += a
        after += b
        console.log(`${(a / 1024).toFixed(0).padStart(6)} KB → ${(b / 1024).toFixed(0).padStart(4)} KB  ${rel}`)
    }
    console.log(`Razem: ${(before / 1048576).toFixed(1)} MB → ${(after / 1048576).toFixed(2)} MB`)
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})
