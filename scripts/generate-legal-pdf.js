/**
 * Generuje PDF dokumentu prawnego z aktualnego tekstu w lib/legal/*.ts (T-007 #1).
 *
 *   node scripts/generate-legal-pdf.js polityka    → public/legal/polityka-prywatnosci-pedro.pdf
 *   node scripts/generate-legal-pdf.js regulamin   → public/legal/regulamin-pedro-beta.pdf
 *
 * Wymaga lokalnie zainstalowanego Chrome lub Edge (drukowanie headless --print-to-pdf).
 * Ścieżkę przeglądarki można podać w zmiennej CHROME_PATH.
 * Po zmianie treści w lib/legal/*.ts uruchom ponownie i zacommituj PDF.
 */
const fs = require('fs')
const os = require('os')
const path = require('path')
const { execFileSync } = require('child_process')
const ts = require('typescript')

const ROOT = path.join(__dirname, '..')

const DOCS = {
    polityka: {
        source: 'lib/legal/politykaPrywatnosci.ts',
        fn: 'getPolitykaPrywatnosciDocument',
        output: 'public/legal/polityka-prywatnosci-pedro.pdf',
    },
    regulamin: {
        source: 'lib/legal/regulamin.ts',
        fn: 'getRegulaminDocument',
        output: 'public/legal/regulamin-pedro-beta.pdf',
    },
}

function loadDocument({ source, fn }) {
    const code = fs.readFileSync(path.join(ROOT, source), 'utf8')
    const js = ts.transpileModule(code, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 },
    }).outputText
    const mod = { exports: {} }
    // Pliki lib/legal importują tylko typy — require nie jest potrzebny w runtime
    new Function('module', 'exports', 'require', js)(mod, mod.exports, () => ({}))
    if (typeof mod.exports[fn] !== 'function') {
        throw new Error(`Brak funkcji ${fn} w ${source}`)
    }
    return mod.exports[fn]()
}

function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Ten sam „markdown” co LegalDocument.tsx: **pogrubienie**, nowe linie; linie „- ” jako lista. */
function renderContent(text) {
    const lines = escapeHtml(text).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').split('\n')
    let html = ''
    let inList = false
    for (const line of lines) {
        if (line.startsWith('- ')) {
            if (!inList) {
                html += '<ul>'
                inList = true
            }
            html += `<li>${line.slice(2)}</li>`
            continue
        }
        if (inList) {
            html += '</ul>'
            inList = false
        }
        if (line.trim()) html += `<p>${line}</p>`
    }
    if (inList) html += '</ul>'
    return html
}

function formatDate(iso) {
    return new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })
}

function toHtml(doc) {
    const sections = doc.content
        .map((section) => {
            const subsections = (section.subsections || [])
                .map(
                    (sub) => `
          <div class="sub">
            ${sub.title ? `<h3>${escapeHtml(sub.title)}</h3>` : ''}
            ${renderContent(sub.content)}
          </div>`
                )
                .join('')
            return `
        <section>
          <h2>${escapeHtml(section.title)}</h2>
          ${section.content ? renderContent(section.content) : ''}
          ${subsections}
        </section>`
        })
        .join('')

    return `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<title>${escapeHtml(doc.title)}</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  body { font-family: "Segoe UI", Arial, sans-serif; font-size: 10.5pt; line-height: 1.5; color: #2D3436; }
  h1 { font-size: 20pt; margin: 0 0 4pt; color: #2D3436; }
  .meta { color: #636e72; font-size: 9.5pt; margin-bottom: 14pt; border-bottom: 2px solid #6C5CE7; padding-bottom: 8pt; }
  h2 { font-size: 13pt; margin: 14pt 0 6pt; color: #6C5CE7; page-break-after: avoid; }
  h3 { font-size: 10.5pt; margin: 8pt 0 3pt; page-break-after: avoid; }
  p { margin: 0 0 5pt; }
  ul { margin: 0 0 5pt; padding-left: 16pt; }
  li { margin-bottom: 2pt; }
  .sub { margin-left: 8pt; }
  section { page-break-inside: auto; }
</style>
</head>
<body>
  <h1>${escapeHtml(doc.title)}</h1>
  <div class="meta">Wersja ${escapeHtml(doc.version)} · ostatnia aktualizacja: ${formatDate(doc.lastUpdated)} · www.pedro.app</div>
  ${sections}
</body>
</html>`
}

function findBrowser() {
    const candidates = [
        process.env.CHROME_PATH,
        'C:/Program Files/Google/Chrome/Application/chrome.exe',
        'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium',
    ].filter(Boolean)
    const found = candidates.find((p) => fs.existsSync(p))
    if (!found) throw new Error('Nie znaleziono Chrome/Edge — ustaw CHROME_PATH')
    return found
}

function main() {
    const key = process.argv[2]
    const config = DOCS[key]
    if (!config) {
        console.error(`Użycie: node scripts/generate-legal-pdf.js <${Object.keys(DOCS).join('|')}>`)
        process.exit(1)
    }
    const doc = loadDocument(config)
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pedro-legal-'))
    const htmlPath = path.join(tmpDir, `${key}.html`)
    fs.writeFileSync(htmlPath, toHtml(doc), 'utf8')
    const output = path.join(ROOT, config.output)
    execFileSync(findBrowser(), [
        '--headless=new',
        '--disable-gpu',
        '--no-pdf-header-footer',
        `--user-data-dir=${path.join(tmpDir, 'profile')}`,
        `--print-to-pdf=${output}`,
        `file:///${htmlPath.replace(/\\/g, '/')}`,
    ], { stdio: 'ignore' })
    fs.rmSync(tmpDir, { recursive: true, force: true })
    console.log(`PDF: ${config.output} (wersja ${doc.version}, ${doc.lastUpdated})`)
}

main()
