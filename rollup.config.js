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
import { spawn } from 'child_process';

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
    globals: {
      three: 'THREE',
      '@smui/common/internal': 'smuiInternal',
      '@smui/common/classadder': 'smuiClassadder',
      '@newkrok/three-particles': 'threeParticles',
      'three/examples/jsm/libs/lil-gui.module.min.js': 'lil',
      'three/examples/jsm/controls/OrbitControls.js': 'OrbitControls',
      'three/examples/jsm/libs/stats.module.js': 'Stats',
    },
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
    resolve({
      browser: true,
      dedupe: ['svelte', 'three'],
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
