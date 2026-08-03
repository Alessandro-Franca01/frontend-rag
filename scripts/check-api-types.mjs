import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'src', 'app', 'core', 'models', 'api.gen.ts');
const apiUrl = process.env.API_URL ?? 'http://localhost:8000';

let spec;
if (process.env.OPENAPI_SPEC) {
  const cached = process.env.OPENAPI_SPEC;
  spec = JSON.parse(readFileSync(cached, 'utf8'));
  console.log(`Using cached spec: ${cached}`);
} else {
  const res = await fetch(`${apiUrl}/openapi.json`);
  if (!res.ok) {
    console.error(`Failed to fetch ${apiUrl}/openapi.json (HTTP ${res.status}).`);
    console.error('Start the backend or set OPENAPI_SPEC to a cached spec file.');
    process.exit(1);
  }
  spec = await res.json();
}

const tmpDir = mkdtempSync(join(tmpdir(), 'api-types-check-'));
const specFile = join(tmpDir, 'openapi.json');
const tmpOut = join(tmpDir, 'api.gen.ts');
writeFileSync(specFile, JSON.stringify(spec));

const gen = spawnSync(
  'npx',
  ['openapi-typescript', specFile, '--output', tmpOut],
  { cwd: root, stdio: 'inherit', shell: true },
);

let drift = false;
if (gen.status !== 0) {
  console.error('openapi-typescript failed; cannot compare.');
  drift = true;
} else {
  const current = readFileSync(outPath, 'utf8');
  const fresh = readFileSync(tmpOut, 'utf8');
  if (current !== fresh) {
    console.error('Drift detected: api.gen.ts is out of sync with the backend schema.');
    console.error('Run `npm run gen:api-types` to regenerate, then commit the result.');
    drift = true;
  }
}

rmSync(tmpDir, { recursive: true, force: true });

if (drift) process.exit(1);
console.log('api.gen.ts is in sync with the backend schema.');
