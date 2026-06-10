import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    var backendOrigin = env.VITE_BLUEBERRYTRACE_BACKEND_ORIGIN || 'http://localhost:8080';
    return {
        plugins: [react()],
        server: {
            port: 5173,
            proxy: {
                '/api': {
                    target: backendOrigin,
                    changeOrigin: true,
                    secure: false
                },
                '/login': {
                    target: backendOrigin,
                    changeOrigin: true,
                    secure: false
                },
                '/logout': {
                    target: backendOrigin,
                    changeOrigin: true,
                    secure: false
                }
            }
        }
    };
});
