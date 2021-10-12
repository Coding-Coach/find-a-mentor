import react from 'react';
import ReactDOMServer from 'react-dom/server.js';
import http from 'http';
import { readFileSync } from 'fs';
import path from 'path';

const app = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  const content = ReactDOMServer.renderToString(<h1>Hello, world!</h1>);

  const page = readFileSync(path.resolve('build/index.html'), 'utf8');
  res.end(
    page.replace('<div id="root"></div>', `<div id="root">${content}</div>`)
  );
});

// Start the server on port 3000
app.listen(3000, '127.0.0.1', 0, () => {
  console.log('Server running');
});
