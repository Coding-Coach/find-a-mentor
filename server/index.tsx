import ReactDOMServer from 'react-dom/server.js';
import { readFileSync } from 'fs';
import path from 'path';
import express from 'express';

const app = express();
app.use(express.static(path.resolve(__dirname, '../../public')));

app.get('/', (req, res) => {
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
