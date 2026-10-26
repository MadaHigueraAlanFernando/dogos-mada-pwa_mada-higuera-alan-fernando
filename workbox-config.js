module.exports = {
  globDirectory: ".",
  globPatterns: [
    "index.html",
    "manifest.json",
    "catalogo.json",
    "css/**/*.css",
    "js/**/*.js",
    "icons/**/*.png",
    "img/**/*.{jpg,jpeg,webp}"
  ],
  globIgnores: [
    "docs/**",
    "servidor-ssr*/**",
    "node_modules/**",
    "workbox-config.js",
    "lighthouse*",
    "**/lighthouse*"
  ],
  swDest: "sw.js",
  skipWaiting: true,
  clientsClaim: true
};
