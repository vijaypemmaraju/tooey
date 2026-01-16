const esbuild = require('esbuild');
const fs = require('fs');

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

  console.log('Build complete!');

  // Log file sizes
  const stats = fs.statSync('dist/tooey.js');
  console.log(`tooey.js: ${(stats.size / 1024).toFixed(2)} KB`);
}

if (watch) {
  esbuild.context(buildOptions).then(ctx => {
    ctx.watch();
    console.log('Watching for changes...');
  });
} else {
  build().catch(() => process.exit(1));
}
