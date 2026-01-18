import esbuild from 'esbuild';
import fs from 'fs';
import { execSync } from 'child_process';

const watch = process.argv.includes('--watch');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

const buildOptions = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: !watch,
  sourcemap: true,
  target: 'es2020',
  external: ['@tooey/ui'],
};

async function build() {
  // UMD-style build (IIFE with global)
  await esbuild.build({
    ...buildOptions,
    outfile: 'dist/index.js',
    format: 'iife',
    globalName: 'tooeyComponents',
    footer: {
      js: 'if(typeof module!=="undefined")module.exports=tooeyComponents;'
    }
  });

  // ESM build
  await esbuild.build({
    ...buildOptions,
    outfile: 'dist/index.esm.js',
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
  const stats = fs.statSync('dist/index.js');
  console.log(`index.js: ${(stats.size / 1024).toFixed(2)} KB`);

  const esmStats = fs.statSync('dist/index.esm.js');
  console.log(`index.esm.js: ${(esmStats.size / 1024).toFixed(2)} KB`);

  // Check for declaration file
  if (fs.existsSync('dist/index.d.ts')) {
    const dtsStats = fs.statSync('dist/index.d.ts');
    console.log(`index.d.ts: ${(dtsStats.size / 1024).toFixed(2)} KB`);
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
