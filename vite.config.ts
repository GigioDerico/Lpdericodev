import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function loadCustomEnv(mode: string) {
  const envMap: Record<string, string> = {
    'development': '.env-dev',
    'homolog': '.env-homolog',
    'production': '.env-prod'
  };
  const envFile = envMap[mode] || `.env-${mode}`;
  const envPath = path.resolve(__dirname, envFile);
  
  const customEnv: Record<string, string> = {};
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    content.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        customEnv[match[1].trim()] = match[2].trim().replace(/^"|"$/g, '');
      }
    });
  }
  return customEnv;
}

export default defineConfig(({ mode }) => {
  const defaultEnv = loadEnv(mode, process.cwd(), '');
  const customEnv = loadCustomEnv(mode);
  
  // Merge envs
  const env = { ...defaultEnv, ...customEnv };

  return {
    define: {
      ...Object.keys(env).reduce((prev: Record<string, string>, key) => {
        if (key.startsWith('VITE_')) {
          prev[`import.meta.env.${key}`] = JSON.stringify(env[key]);
        }
        return prev;
      }, {})
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['framer-motion', 'lucide-react', '@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          },
        },
      },
    },
    assetsInclude: ['**/*.svg', '**/*.csv'],
  };
})
