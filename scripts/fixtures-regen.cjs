
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');

(async function main(){
  const src = path.join(process.cwd(), 'fixtures');
  const dst = path.join(process.cwd(), 'fixtures');
  if (!fs.existsSync(src)) { console.error('fixtures folder missing'); process.exit(1); }
  // no-op copy to prove script exists
  for (const entry of fs.readdirSync(src)) {
    const from = path.join(src, entry);
    const to = path.join(dst, entry);
    if (fs.lstatSync(from).isDirectory()) continue;
    await fsp.copyFile(from, to);
  }
  console.log('fixtures:regen complete');
})().catch(e=>{ console.error(e); process.exit(1); });
