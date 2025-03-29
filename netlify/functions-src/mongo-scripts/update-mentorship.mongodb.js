// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

const { ObjectId } = require('mongodb');

// The current database to use.
use('codingcoach');

// Create a new document in the collection.
// db.getCollection('mentorships').find(
//   { _id: new ObjectId('67e049568a3938d0aac4a216') },
// );
db.getCollection('mentorships').updateOne(
  { _id: new ObjectId('67e140e3bcacb881b788c9eb') },
  {
    $set: {
      status: 'New',
    },
  },
);