import * as esbuild from 'esbuild';
import { execSync } from 'child_process';

const isWatch = process.argv.includes('--watch');
const isDev = process.argv.includes('--dev') || isWatch;

// common build options
const commonOptions = {
  bundle: true,
  minify: !isDev,
  sourcemap: true,
  target: 'es2020',
  external: ['@tooey/ui'],
  platform: 'neutral',
};

// main entry point
const mainConfigs = [
  {
    ...commonOptions,
    entryPoints: ['src/index.ts'],
    outfile: 'dist/server.js',
    format: 'cjs',
  },
  {
    ...commonOptions,
    entryPoints: ['src/index.ts'],
    outfile: 'dist/server.esm.js',
    format: 'esm',
  },
];

// node adapter
const nodeConfigs = [
  {
    ...commonOptions,
    entryPoints: ['src/adapters/node.ts'],
    outfile: 'dist/node.js',
    format: 'cjs',
    platform: 'node',
  },
  {
    ...commonOptions,
    entryPoints: ['src/adapters/node.ts'],
    outfile: 'dist/node.esm.js',
    format: 'esm',
    platform: 'node',
  },
];

// edge adapter
const edgeConfigs = [
  {
    ...commonOptions,
    entryPoints: ['src/adapters/edge.ts'],
    outfile: 'dist/edge.js',
    format: 'cjs',
  },
  {
    ...commonOptions,
    entryPoints: ['src/adapters/edge.ts'],
    outfile: 'dist/edge.esm.js',
    format: 'esm',
  },
];

const allConfigs = [...mainConfigs, ...nodeConfigs, ...edgeConfigs];

async function build() {
  console.log(`building @tooey/server${isDev ? ' (dev mode)' : ''}...`);

  try {
    // generate type declarations
    console.log('generating type declarations...');
    execSync('npx tsc -p tsconfig.build.json', { stdio: 'inherit' });

    if (isWatch) {
      // watch mode: use esbuild's watch api
      const contexts = await Promise.all(
        allConfigs.map((config) => esbuild.context(config))
      );

      await Promise.all(contexts.map((ctx) => ctx.watch()));
      console.log('watching for changes...');
    } else {
      // single build
      await Promise.all(allConfigs.map((config) => esbuild.build(config)));
      console.log('build complete!');
    }
  } catch (error) {
    console.error('build failed:', error);
    process.exit(1);
  }
}

build();
