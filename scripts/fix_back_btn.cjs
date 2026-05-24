const fs = require('fs');
const path = require('path');
const appPath = path.join(__dirname, '..', 'src', 'App.tsx');
let c = fs.readFileSync(appPath, 'utf8');

const oldStart = c.indexOf('fixed bottom-6 right-6');
if (oldStart === -1) {
  console.log('Pattern not found');
  process.exit(0);
}
const buttonStart = c.lastIndexOf('<button', oldStart);
const buttonEnd = c.indexOf('</button>', buttonStart) + '</button>'.length;

const newButton = `<button
                onClick={exitChat}
                className="fixed top-6 left-8 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border shadow-sm text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-200"
              >
                <ArrowUp className="w-4 h-4 -rotate-90" />
                返回工作台
              </button>`;

c = c.substring(0, buttonStart) + newButton + c.substring(buttonEnd);

fs.writeFileSync(appPath, c);
console.log('Fixed successfully');
