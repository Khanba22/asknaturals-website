import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(ROOT, 'frontend', 'videos-source');
const PUBLIC_DIR = path.join(ROOT, 'frontend', 'public');

const JOBS = [
  {
    sourceName: 'desktop.mp4',
    publicName: 'desktop_animation.mp4',
    maxWidth: 1280,
    maxHeight: 720,
  },
  {
    sourceName: 'mobile.mp4',
    publicName: 'mobile_animation.mp4',
    maxWidth: 720,
    maxHeight: 1280,
  },
];

function encode(inputPath, outputPath, { maxWidth, maxHeight }) {
  const tempPath = `${outputPath}.tmp.mp4`;
  const scaleFilter = `scale='min(${maxWidth},iw)':'min(${maxHeight},ih)':force_original_aspect_ratio=decrease,pad=ceil(iw/2)*2:ceil(ih/2)*2`;
  const command = [
    'ffmpeg -y',
    `-i "${inputPath}"`,
    '-an',
    `-vf "${scaleFilter}"`,
    '-c:v libx264',
    '-profile:v high',
    '-pix_fmt yuv420p',
    '-preset fast',
    '-crf 23',
    '-g 1',
    '-keyint_min 1',
    '-sc_threshold 0',
    '-movflags +faststart',
    `"${tempPath}"`,
  ].join(' ');

  console.log(`Encoding ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
  execSync(command, { stdio: 'inherit' });
  fs.renameSync(tempPath, outputPath);
}

function resolveInput(job) {
  const sourcePath = path.join(SOURCE_DIR, job.sourceName);
  if (fs.existsSync(sourcePath)) return sourcePath;

  const publicPath = path.join(PUBLIC_DIR, job.publicName);
  if (fs.existsSync(publicPath)) return publicPath;

  return null;
}

function main() {
  if (!fs.existsSync(SOURCE_DIR)) {
    fs.mkdirSync(SOURCE_DIR, { recursive: true });
  }

  let encoded = 0;

  for (const job of JOBS) {
    const inputPath = resolveInput(job);
    const outputPath = path.join(PUBLIC_DIR, job.publicName);

    if (!inputPath) {
      console.warn(`Skipping ${job.publicName}: no source found`);
      continue;
    }

    encode(inputPath, outputPath, job);
    encoded += 1;
  }

  if (encoded === 0) {
    console.log('No hero videos found. Add either:');
    console.log('  frontend/videos-source/desktop.mp4 + mobile.mp4');
    console.log('  frontend/public/desktop_animation.mp4 + mobile_animation.mp4');
    return;
  }

  console.log(`Done. Encoded ${encoded} scrub-optimized hero video(s).`);
}

main();
