const { buildAssets } = require('./scripts/build');

module.exports = function(eleventyConfig) {
    // Optional loopback PHP for local contact verification; production is static + PHP.
    const phpPort = Number(process.env.FORESTAL_PHP_PORT);
    if (process.env.NODE_ENV === 'development' && Number.isInteger(phpPort) && phpPort > 1024 && phpPort <= 65535) {
      eleventyConfig.setServerOptions({ middleware: [(req, res, next) => {
        if (req.url.split('?')[0] !== '/enviar_mensaje.php') return next();
        return new Promise((resolve) => {
          const upstream = require('node:http').request({ hostname: '127.0.0.1', port: phpPort, path: req.url, method: req.method, headers: req.headers }, (response) => {
            const chunks = [];
            response.on('data', (chunk) => chunks.push(chunk));
            response.on('end', () => {
              const headers = { ...response.headers };
              delete headers['content-length'];
              delete headers['transfer-encoding'];
              res.writeHead(response.statusCode, headers);
              // Eleventy transforms HTML strings for live reload; piping Buffers bypasses that wrapper.
              res.end(Buffer.concat(chunks).toString('utf8'));
              resolve();
            });
          });
          upstream.setTimeout(10000, () => upstream.destroy(new Error('PHP local timeout')));
          upstream.on('error', () => {
            res.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ ok: false }));
            resolve();
          });
          req.pipe(upstream);
        });
      }] });
    }
    eleventyConfig.on('eleventy.beforeWatch', async () => {
      if (process.env.NODE_ENV === 'development') await buildAssets();
    });

    // Fecha del build en formato YYYY-MM-DD. La usa el sitemap para <lastmod>:
    // antes estaba fija en 2026-05-27 y nunca se actualizaba, asi que Google
    // recibia siempre una fecha vieja. Se evalua en cada build (function).
    eleventyConfig.addGlobalData('buildDate', () => new Date().toISOString().slice(0, 10));

    eleventyConfig.addFilter("htmlDateString", (dateObj) => {
      const date = dateObj instanceof Date ? dateObj : new Date(dateObj);
      return date.toISOString().slice(0, 10);
    });

    eleventyConfig.addPassthroughCopy("src/.htaccess");
    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addPassthroughCopy("src/animations");
    eleventyConfig.addPassthroughCopy("src/**/*.php");
    eleventyConfig.addPassthroughCopy({ ".cache/site-assets/dist": "assets" });
    for (const source of [
      "src/css/tailwind.css",
      "src/css/styles.css",
      "src/css/home.css",
      "src/js/main.js",
      "src/js/home.js",
      "src/images",
      "scripts/site.css",
      "tailwind.config.js",
    ]) {
      eleventyConfig.addWatchTarget(source);
    }
    
    // Layout alias
    eleventyConfig.addLayoutAlias("base", "layouts/base.njk");

  
    return {
      dir: {
        input: "src",
        output: "_site",
        includes: "_includes",
        data: "_data" // Asegúrate de que esto esté correcto
      },
      templateFormats: ["njk", "html", "md"],
      htmlTemplateEngine: "njk"
    };
  };
