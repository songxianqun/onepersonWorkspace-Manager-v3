const fs = require('fs');
const c = fs.readFileSync('D:/2026 AI/onepersonWorkspace-Manager-v3/src/components/PageChatBar.tsx', 'utf8');
// Replace the placeholder with a simple plain text version
const result = c.replace(
  `placeholder={placeholder || "向 AI 助手提问，或输入处理指令\u2026"}`,
  `placeholder={placeholder || "向 AI 助手提问，或输入处理指令..."}`
);
fs.writeFileSync('D:/2026 AI/onepersonWorkspace-Manager-v3/src/components/PageChatBar.tsx', result);
console.log('Done');
