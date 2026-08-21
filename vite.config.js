import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

process.env.BROWSER = 'chrome'

export default defineConfig({
plugins: [
react(),
tailwindcss(),
VitePWA({
registerType: 'autoUpdate',
includeAssets: ['favicon.svg', 'icons.svg'],
manifest: {
name: 'Town Hub Hyperlocal',
short_name: 'TownHub',
description: 'Hyperlocal Marketplace & Services for Alwar',
theme_color: '#4338ca',
background_color: '#0f172a',
display: 'standalone',
orientation: 'portrait',
start_url: '/',
icons: [
{
src: 'favicon.svg',
sizes: '192x192 512x512',
type: 'image/svg+xml',
purpose: 'any maskable'
}
]
},
workbox: {
// Cache static JS/CSS chunks and HTML for instant offline booting
globPatterns: ['/*.{js,css,html,svg,png,ico}'],
runtimeCaching: [
{
// Cache local images and CDN assets with a Stale-While-Revalidate policy
urlPattern: ({ request }) => request.destination === 'image',
handler: 'StaleWhileRevalidate',
options: {
cacheName: 'images-cache',
expiration: {
maxEntries: 100,
maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
},
},
},
],
},
}),
],
server: {
open: true,
},
})