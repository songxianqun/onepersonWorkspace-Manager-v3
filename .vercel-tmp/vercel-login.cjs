#!/usr/bin/env node
const { spawnSync, spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const isWindows = os.platform() === 'win32';
function log(msg) { console.error(msg); }
const LOG_FILE = path.join(process.cwd(), '.vercel-tmp', 'login.log');
function checkLoginStatus() {
  try {
    const result = spawnSync('vercel', ['whoami'], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], shell: isWindows });
    const output = (result.stdout || '').trim();
    if (result.status === 0 && output && !output.includes('Error') && !output.includes('not logged in')) {
      log('Logged in as: ' + output); return true;
    }
  } catch {}
  return false;
}
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
function startBackgroundLogin() {
  const logStream = fs.openSync(LOG_FILE, 'w');
  const child = spawn('vercel', ['login'], { detached: true, stdio: ['ignore', logStream, logStream], shell: isWindows });
  child.unref();
  log('Background login process started (PID: ' + child.pid + ')');
  fs.writeFileSync(LOG_FILE + '.pid', String(child.pid));
  return child.pid;
}
function openBrowser(url) {
  try {
    const platform = os.platform();
    if (platform === 'darwin') spawnSync('open', [url], { stdio: 'ignore' });
    else if (platform === 'win32') spawnSync('powershell', ['-Command', "Start-Process '" + url + "'"], { stdio: 'ignore', windowsHide: true });
    else spawnSync('xdg-open', [url], { stdio: 'ignore' });
    log('Browser opened automatically');
  } catch (error) { log('Failed to open browser: ' + error.message); }
}
async function waitForAuthUrl() {
  for (let i = 0; i < 40; i++) {
    await sleep(500);
    try {
      if (fs.existsSync(LOG_FILE)) {
        const content = fs.readFileSync(LOG_FILE, 'utf8');
        const idx = content.indexOf('https://vercel.com/oauth/device?user_code=');
        if (idx !== -1) {
          const rest = content.slice(idx);
          const end = rest.search(/[\s\n]/);
          return end === -1 ? rest : rest.slice(0, end);
        }
      }
    } catch (e) { if (e.code !== 'ENOENT') log('Warning: ' + (e.code || e.message)); }
  }
  return null;
}
async function main() {
  log('======================================== Vercel Login ========================================');
  if (checkLoginStatus()) { console.log(JSON.stringify({ status: 'already_logged_in' })); process.exit(0); }
  log('Starting login...');
  const pid = startBackgroundLogin();
  log('Waiting for authorization URL...');
  const authUrl = await waitForAuthUrl();
  if (authUrl) {
    openBrowser(authUrl);
    console.log(JSON.stringify({ status: 'needs_auth', auth_url: authUrl, log_file: LOG_FILE }));
  } else {
    log('Failed to get authorization URL');
    try { log('Log: ' + fs.readFileSync(LOG_FILE, 'utf8')); } catch {}
    process.exit(1);
  }
}
main();
