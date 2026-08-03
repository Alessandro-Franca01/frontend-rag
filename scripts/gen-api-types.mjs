import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from 'node:fs';import { tmpdir } from 'node:os';
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
    console.error('Start the backend (uvicorn app.main:app --port 8000) or set OPENAPI_SPEC to a cached spec file.');
    process.exit(1);
  }
  spec = await res.json();
}

const tmpDir = mkdtempSync(join(tmpdir(), 'api-types-'));
const specFile = join(tmpDir, 'openapi.json');
writeFileSync(specFile, JSON.stringify(spec));

const gen = spawnSync(
  'npx',
  ['openapi-typescript', specFile, '--output', outPath],
  { cwd: root, stdio: 'inherit', shell: true },
);
rmSync(tmpDir, { recursive: true, force: true });

if (gen.status !== 0) {
  console.error('Failed to generate api.gen.ts.');
  process.exit(gen.status ?? 1);
}
console.log(`Generated ${outPath}`);
