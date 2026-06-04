import { copyFileSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const docsDir = join(root, 'docs')
const dest = join(root, 'public', 'report-old.html')

const htmlReports = existsSync(docsDir)
  ? readdirSync(docsDir).filter((name) => name.endsWith('.html'))
  : []
const sourceName = htmlReports.find((name) => !name.includes('V3')) ?? htmlReports[0]
const source = sourceName ? join(docsDir, sourceName) : undefined

if (source && existsSync(source)) {
  copyFileSync(source, dest)
  console.log(`Synced old report ${sourceName} -> public/report-old.html`)
} else {
  console.log('Source report not found in', docsDir)
}
