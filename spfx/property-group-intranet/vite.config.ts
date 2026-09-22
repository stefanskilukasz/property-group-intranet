import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev-only preview harness config (see preview/README.md). Not used by the
// SPFx build (gulp) at all — this exists purely so the shell can be checked
// in an ordinary browser without SharePoint or a trusted dev certificate.
export default defineConfig({
  root: 'preview',
  plugins: [react()]
});
