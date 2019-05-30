const express = require('express');
const fetch = require('node-fetch');
var cors = require('cors')

const app = express();
const port = 3002;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

app.use('/api', cors(), function(req, res) {
  const url = 'http://api.codingcoach.io/users' + req.url;
  const { method, body, headers } = req;
  fetch(url, {
    method,
    body: method === 'GET' ? undefined : JSON.stringify(body),
    headers: {
      Authorization: headers.authorization,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(data => {
    res.status(data.status);
    return data.json();
  }).then(data => {
    res.send(data);
  }).catch(e => {
    res.send({
      message: e
    })
  })
});

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/get_mentors', (req, res) => {
  res.json([
    {
      name: 'Steve Sanders',
      avatar: 'https://react.semantic-ui.com/images/avatar/large/steve.jpg',
    },
    {
      name: 'Molly Thomas',
      avatar: 'https://react.semantic-ui.com/images/avatar/large/molly.png',
    },
  ]);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
