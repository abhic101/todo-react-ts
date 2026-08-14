import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';


export default defineConfig({
    plugins: [
        react(),
        tailwindcss()
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components/index.component'),
            '@assets': path.resolve(__dirname, './src/assets'),
            '@hooks': path.resolve(__dirname, './src/hooks/index.hook'),
            '@context': path.resolve(__dirname, './src/context/index.context'),
            '@api': path.resolve(__dirname, './src/apis/index.api')
        }
    },
    envDir : './src/config'
})