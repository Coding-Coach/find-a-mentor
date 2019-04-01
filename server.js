const express = require('express');
const app = express();
const port = 3001;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
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
