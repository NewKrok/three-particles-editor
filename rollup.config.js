import autoPreprocess from 'svelte-preprocess';
import commonjs from '@rollup/plugin-commonjs';
import css from 'rollup-plugin-css-only';
import livereload from 'rollup-plugin-livereload';
import resolve from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import terser from '@rollup/plugin-terser';
import esbuild from 'rollup-plugin-esbuild';
import replace from '@rollup/plugin-replace';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

// Ensure a single three.js instance across the bundle.
//
// Problem: `three/tsl` re-exports from `three/webgpu` which is a self-contained
// 82K-line build containing its own copy of three.js internals. Meanwhile, bare
// `import * as THREE from 'three'` resolves to `three.module.js` — a separate
// copy. Two instances means the TSL node registry (where `If`, `Fn`, etc. live)
// is split, causing null references at runtime.
//
// Solution: redirect bare `'three'` imports to `'three/webgpu'` so the entire
// bundle shares the single WebGPU-capable three.js build.
function dedupeThree() {
  return {
    name: 'dedupe-three',
    resolveId(source) {
      if (source === 'three') {
        return { id: fileURLToPath(import.meta.resolve('three/webgpu')), moduleSideEffects: true };
      }
      if (source.startsWith('three/')) {
        try {
          return { id: fileURLToPath(import.meta.resolve(source)), moduleSideEffects: true };
        } catch {
          return null;
        }
      }
      return null;
    },
  };
}

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

const production = !process.env.ROLLUP_WATCH;

// Format date as MMMM DD, YYYY
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const buildDate = formatDate(new Date());

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true,
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js',
  },

  plugins: [
    // Replace version and build date placeholders
    replace({
      preventAssignment: true,
      values: {
        __APP_VERSION__: pkg.version,
        __BUILD_DATE__: buildDate,
      },
    }),

    // Add TypeScript support with esbuild
    esbuild({
      include: /\.[jt]sx?$/,
      exclude: /node_modules/,
      sourceMap: !production,
      minify: false,
      target: 'es2018',
      tsconfig: './tsconfig.json',
      loaders: {
        '.json': 'json',
      },
    }),

    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
      preprocess: autoPreprocess({
        typescript: {
          tsconfigFile: './tsconfig.json',
        },
        scss: {
          /** options */
        },
      }),
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: 'bundle.css' }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    dedupeThree(),

    resolve({
      browser: true,
      dedupe: ['svelte'],
      exportConditions: ['svelte', 'module', 'import', 'default'],
      mainFields: ['module', 'main', 'browser'],
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json', '.svelte'],
    }),
    commonjs(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
