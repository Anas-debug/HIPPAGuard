import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  },
  resolve: {
    alias: {
      'react-quill/dist/quill.snow.css': '/dev/null',
      '@mantine/core': '/dev/null',
      '@mantine/rte': '/dev/null',
      '@mantine/dates': '/dev/null',
      '@tabler/icons-react': '/dev/null'
    }
  }
});
