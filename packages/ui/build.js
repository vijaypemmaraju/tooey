import esbuild from 'esbuild';
import fs from 'fs';
import { execSync } from 'child_process';

const watch = process.argv.includes('--watch');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

const buildOptions = {
  entryPoints: ['src/tooey.ts'],
  bundle: true,
  minify: !watch,
  sourcemap: true,
  target: 'es2020',
};

async function build() {
  // UMD-style build (IIFE with global)
  await esbuild.build({
    ...buildOptions,
    outfile: 'dist/tooey.js',
    format: 'iife',
    globalName: 'tooey',
    footer: {
      js: 'if(typeof module!=="undefined")module.exports=tooey;'
    }
  });

  // ESM build
  await esbuild.build({
    ...buildOptions,
    outfile: 'dist/tooey.esm.js',
    format: 'esm',
  });

  // Generate TypeScript declarations (src only)
  console.log('Generating TypeScript declarations...');
  try {
    execSync('npx tsc --emitDeclarationOnly --declaration --declarationDir dist --project tsconfig.build.json', {
      stdio: 'inherit'
    });
    console.log('TypeScript declarations generated!');
  } catch (err) {
    console.error('Failed to generate TypeScript declarations:', err.message);
    process.exit(1);
  }

  console.log('Build complete!');

  // Log file sizes
  const stats = fs.statSync('dist/tooey.js');
  console.log(`tooey.js: ${(stats.size / 1024).toFixed(2)} KB`);

  // Check for declaration file
  if (fs.existsSync('dist/tooey.d.ts')) {
    const dtsStats = fs.statSync('dist/tooey.d.ts');
    console.log(`tooey.d.ts: ${(dtsStats.size / 1024).toFixed(2)} KB`);
  }
}

if (watch) {
  esbuild.context(buildOptions).then(ctx => {
    ctx.watch();
    console.log('Watching for changes...');
  });
} else {
  build().catch(() => process.exit(1));
}
