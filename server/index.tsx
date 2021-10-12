import ReactDOMServer from 'react-dom/server.js';
import { App } from '../src/App';
import { readFileSync } from 'fs';
import path from 'path';
import express from 'express';

const app = express();

app.use((req, res, next) => {
  const pathname = req.path;
  if (pathname.startsWith('/static/')) {
    res.sendFile(path.join(__dirname, '..', 'build', pathname));
    return;
  }
  next();
});

app.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  const content = ReactDOMServer.renderToString(<App />);

  const page = readFileSync(path.resolve('build/index.html'), 'utf8');
  res.end(
    page.replace('<div id="root"></div>', `<div id="root">${content}</div>`)
  );
});

// Start the server on port 3000
app.listen(3000, '127.0.0.1', 0, () => {
  console.log('Server running');
});
