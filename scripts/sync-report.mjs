import { copyFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const source = join(root, 'docs', '员工工作台三端协同方案汇报.html')
const dest = join(root, 'public', 'report-old.html')

if (existsSync(source)) {
  copyFileSync(source, dest)
  console.log('Synced old report → public/report-old.html')
} else {
  console.log('Source report not found at', source)
}
