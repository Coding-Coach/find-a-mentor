// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

const { stat } = require('fs');
const { ObjectId } = require('mongodb');

// The current database to use.
use('codingcoach');

// Create a new document in the collection.
db.getCollection('applications').findOneAndUpdate(
  {_id: new ObjectId('67e99efa8eb43562ce98b410')},
  { $set: { status: 'Pending' } },
  { returnDocument: 'after' }
);