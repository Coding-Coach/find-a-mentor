// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('codingcoach');

// Create a new document in the collection.
db.getCollection('users').deleteOne(
  { _id: new ObjectId('6803e5702de92c770092fc6b') },
);