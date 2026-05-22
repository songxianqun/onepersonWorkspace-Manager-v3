import { copyFileSync } from 'fs'

copyFileSync('docs/员工工作台-三端协同方案汇报.html', 'public/report.html')
console.log('Synced report → public/report.html')
