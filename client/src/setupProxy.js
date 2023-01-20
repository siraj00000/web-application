const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://52.36.197.217/',
            changeOrigin: true,
        })
    );
};