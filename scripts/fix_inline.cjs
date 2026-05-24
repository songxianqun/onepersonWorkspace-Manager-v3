const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, '..', 'src', 'components', 'AIChatInline.tsx');
let c = fs.readFileSync(target, 'utf8');

// 1. Fix header: swap to avatar-left + return-button-right
const h1 = '<div className="max-w-[1200px] mx-auto flex items-center justify-between">';
const h1idx = c.indexOf(h1);
const h1end = c.indexOf('</div>', h1idx) + 7; // closing </div> of the inner div

const oldHeaderBlock = c.substring(h1idx, h1end);
const newHeaderBlock = `<div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-border">
              <img src={agentImage} alt={agentName} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">{agentName}</div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
                在线
              </div>
            </div>
          </div>
          <button
            onClick={exitChat}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowUp className="w-4 h-4 -rotate-90" />
            <span>返回工作台</span>
          </button>
        </div>`;

c = c.replace(oldHeaderBlock, newHeaderBlock);

// 2. Fix messages area width to 1200px
c = c.replace(
  '<div className="flex-1 px-6 py-6">\n        <div className="max-w-[800px] mx-auto space-y-5">',
  '<div className="flex-1 px-6 lg:px-8 py-6">\n        <div className="max-w-[1200px] mx-auto space-y-5">'
);

// 3. Fix input box: match main workspace size
const inputSection = '<div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-4 pb-4 px-6">\n        <div className="max-w-[800px] mx-auto">\n          <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-2.5 shadow-elevated focus-within:shadow-glow focus-within:border-primary/40 transition-shadow">\n            <Sparkles className="w-4 h-4 text-primary shrink-0" />\n            <input\n              type="text"\n              value={input}\n              onChange={(e) => setInput(e.target.value)}\n              onKeyDown={(e) => e.key === "Enter" && handleSend()}\n              placeholder={`';
// find the input section by looking for the distinctive px-4 py-2.5 pattern
const oldInputMatch = c.match(/<div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-4 pb-4 px-6">[\s\S]*?AI 助手基于内部数据提供参考，重要决策请以实际数据为准[\s\S]*?<\/p>\s*<\/div>\s*<\/div>/);
if (oldInputMatch) {
  const oldInputBlock = oldInputMatch[0];
  const newInputBlock = `<div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-4 pb-4 px-6 lg:px-8">\n        <div className="max-w-[1200px] mx-auto">\n          <div className="flex items-center gap-4 bg-card border border-border rounded-2xl px-5 py-3.5 shadow-elevated focus-within:shadow-glow focus-within:border-primary/40 transition-shadow">\n            <Sparkles className="w-5 h-5 text-primary shrink-0" />\n            <input\n              type="text"\n              value={input}\n              onChange={(e) => setInput(e.target.value)}\n              onKeyDown={(e) => e.key === "Enter" && handleSend()}\n              placeholder={placeholderText}\n              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"\n            />\n            <button\n              onClick={handleSend}\n              disabled={!input.trim()}\n              className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-30 hover:bg-primary/90 transition-all shrink-0"\n            >\n              <Send className="w-4 h-4" />\n            </button>\n          </div>\n          <p className="text-center text-[11px] text-muted-foreground/60 mt-2">\n            AI 助手基于内部数据提供参考，重要决策请以实际数据为准\n          </p>\n        </div>\n      </div>`;
  c = c.replace(oldInputBlock, newInputBlock);
}

fs.writeFileSync(target, c);
console.log('Done');
