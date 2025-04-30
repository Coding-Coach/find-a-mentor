const express = require('express');
const { compile } = require('ejs');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const app = express();
const port = 3003;
const layout = fs.readFileSync(`${__dirname}/layout.html`, {
  encoding: 'utf8',
});

function injectData(template, data) {
  const content = compile(template)({
    ...data,
    baseUrl: 'https://example.com',
  });
  return compile(layout)({
    content,
  });
}

app.get('/', function (req, res) {
  // Return README.md content if templateName is empty
  const readmePath = path.join(__dirname, 'README.md');
  const readmeContent = fs.readFileSync(readmePath, { encoding: 'utf8' });
  const htmlContent = marked(readmeContent);
  return res.send(htmlContent);
});

app.get('/:templateName', function (req, res) {
  const { templateName } = req.params;
  if (templateName.includes('.')) return;
  const { data } = req.query;
  const template = fs.readFileSync(
    `${__dirname}/${templateName}.html`,
    { encoding: 'utf8' },
  );
  const content = injectData(
    template,
    JSON.parse(data || '{}'),
  );
  res.send(content);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
