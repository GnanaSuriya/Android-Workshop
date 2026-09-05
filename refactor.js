const fs = require('fs');

// Refactor app.js
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace(/const DB = \{[\s\S]*?\n\};/, `const DB = {
  async getAll() {
    try {
      const res = await fetch('/api/list-registrations');
      return await res.json();
    } catch { return {}; }
  },

  async register(participant) {
    await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(participant)
    });
  },

  async getById(id) {
    if (!id) return null;
    try {
      const res = await fetch('/api/get-registration?id=' + encodeURIComponent(id.trim().toUpperCase()));
      if (!res.ok) return null;
      return await res.json();
    } catch { return null; }
  },

  async markAttendance(id) {
    try {
      const res = await fetch('/api/mark-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id.trim().toUpperCase() })
      });
      return await res.json();
    } catch {
      return { ok: false, reason: 'error', id };
    }
  }
};`);

app = app.replace(/document\.getElementById\('reg-form'\)\.addEventListener\('submit', function\(e\) \{([\s\S]*?)DB\.register\(reg\);([\s\S]*?)\}\);/, `document.getElementById('reg-form').addEventListener('submit', async function(e) {$1await DB.register(reg);$2});`);

app = app.replace(/function buildRegListInner\(\) \{/, `async function buildRegListInner() {`);
app = app.replace(/const items = Object\.values\(DB\.getAll\(\)\);/, `const items = Object.values(await DB.getAll());`);

app = app.replace(/\$\{buildRegListInner\(\)\}/, `<div id="list-container"><div style="text-align:center;padding:20px;color:var(--text-secondary);">Loading registrations...</div></div>`);

app = app.replace(/function switchCoordTab\(tab\) \{([\s\S]*?)if \(tab === 'scan'\) startCamera\(\); else stopCamera\(\);\n\}/, `async function switchCoordTab(tab) {$1
  if (tab === 'list') {
    const container = document.getElementById('list-container');
    if (container) {
      container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-secondary);">Loading registrations...</div>';
      container.innerHTML = await buildRegListInner();
    }
  }
  if (tab === 'scan') startCamera(); else stopCamera();
}`);

app = app.replace(/function handleValidation\(id\) \{([\s\S]*?)const result = DB\.markAttendance\(id\);/, `async function handleValidation(id) {
  _showAttendanceResult({ type: 'loading' });
  const result = await DB.markAttendance(id);`);

app = app.replace(/function buildAttendanceResult\(result\) \{([\s\S]*?)let checkIcon, checkClass, titleHtml, detailsHtml;/, `function buildAttendanceResult(result) {
  if (result.type === 'loading') {
    return \`
    <div id="screen-attendance" class="screen">
      <div class="attendance-inner screen-container" style="justify-content:center;">
        <div class="spinner" style="width:40px;height:40px;border-width:4px;"></div>
        <div style="margin-top:20px;color:var(--text-secondary);">Verifying...</div>
      </div>
    </div>\`;
  }$1let checkIcon, checkClass, titleHtml, detailsHtml;`);

fs.writeFileSync('app.js', app);

// Refactor verify.html
let verify = fs.readFileSync('verify.html', 'utf8');

verify = verify.replace(/function dbGetAll\(\) \{[\s\S]*?\n\}/, ``);
verify = verify.replace(/function dbGetById\(id\) \{[\s\S]*?\n\}/, `async function dbGetById(id) {
  try {
    const res = await fetch('/api/get-registration?id=' + encodeURIComponent(id.trim().toUpperCase()));
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}`);
verify = verify.replace(/function dbMarkAttendance\(id\) \{[\s\S]*?\n\}/, `async function dbMarkAttendance(id) {
  try {
    const res = await fetch('/api/mark-attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id.trim().toUpperCase() })
    });
    return await res.json();
  } catch {
    return { ok: false, reason: 'error' };
  }
}`);

verify = verify.replace(/function markAttendance\(id\) \{([\s\S]*?)const result = dbMarkAttendance\(id\);/, `async function markAttendance(id) {
  const btn = document.querySelector('.btn-primary');
  if (btn) btn.innerHTML = '<div class="spinner"></div>';
  const result = await dbMarkAttendance(id);`);

verify = verify.replace(/document\.addEventListener\('DOMContentLoaded', \(\) => \{([\s\S]*?)setTimeout\(\(\) => \{([\s\S]*?)const participant = dbGetById\(regId\);/, `document.addEventListener('DOMContentLoaded', () => {
  setTimeout(async () => {
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    const regId = parseRegId();
    if (!regId) {
      loading.style.display = 'none';
      content.style.display = 'flex';
      content.innerHTML = \`<div class="status-icon error-state">\${S.x}</div><div class="status-title" style="color:var(--error);">INVALID LINK</div><div class="card"><div class="error-text">No registration ID found in this link.</div></div><button class="btn btn-ghost" style="margin-top:8px;" onclick="history.back()">← Go Back</button>\`;
      return;
    }
    const participant = await dbGetById(regId);`);

fs.writeFileSync('verify.html', verify);
console.log("Refactoring complete");
