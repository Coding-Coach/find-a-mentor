import ReactDOMServer from 'react-dom/server.js';
import { readFileSync } from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import express from 'express';
import { StaticRouter } from 'react-router-dom';

import { Routes } from '../src/ssr/Routes';
import { getData as getHomeData } from '../src/ssr/Home';
import { getData as getUserData } from '../src/ssr/User';

const app = express();

app.use((req, res, next) => {
  const pathname = req.path;
  if (pathname.startsWith('/static/')) {
    res.sendFile(path.join(__dirname, '..', 'build', pathname));
    return;
  }
  next();
});

const page = readFileSync(path.resolve('build/index.html'), 'utf8');

function flush(res: express.Response, content: string, model: any) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(
    page.replace(
      '<div id="root"></div>',
      `
    <script>window.ssrData = ${JSON.stringify(model)}</script>
    <div id="root">${content}</div>`
    )
  );
}

function render(req: express.Request, ssrData: any) {
  try {
    return ReactDOMServer.renderToString(
      <StaticRouter location={req.url} context={{}}>
        <Routes ssrData={ssrData} />
      </StaticRouter>
    );
  } catch (error) {
    console.log(error);
    return `Error :(
      ${error}`;
  }
}

app.get('/s/:id', async (req, res) => {
  const todo = await getUserData(fetch, req.params.id);
  flush(res, render(req, todo), todo);
});

app.get('/', async (req, res) => {
  const todos = await getHomeData(fetch);
  flush(res, render(req, todos), todos);
});

// Start the server on port 3000
app.listen(3000, '127.0.0.1', 0, () => {
  console.log('Server running');
});
