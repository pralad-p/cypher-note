// preload.js
const { contextBridge } = require('electron');

let analytics;
if (process.env.NODE_ENV !== 'development') {
  analytics = require('@vercel/analytics').inject;
}

contextBridge.exposeInMainWorld('electronAPI', {
  injectAnalytics: () => analytics && analytics()
});
