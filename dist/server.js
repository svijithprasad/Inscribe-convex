const express = require('express');
const proxy = require('express-http-proxy');
require('dotenv').config();

const app = express();
const allowedOrigins = ['http://127.0.0.1:5501']; // Update with your actual Live Server URL

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    next();
  } else {
    return res.status(403).send('Access denied');
  }
});

app.use('/', proxy('https://api.unsplash.com', {
  proxyReqPathResolver: request => {
    const parts = request.url.split('?');
    return `${parts[0]}?client_id=${process.env.Sdk2IwOsR8S6BQlsczhd9_D2VTlzqvmiFmFqrxOL4ZY}` + (parts.length ? `&${parts[1]}` : '');
  },
}));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
