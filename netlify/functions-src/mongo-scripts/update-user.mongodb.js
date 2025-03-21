// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('codingcoach');

// Create a new document in the collection.
db.getCollection('users').updateOne(
  { email: 'moshfeu@gmail.com' },
  {
    $set: {
      roles: ['Member', 'Mentor', 'Admin'],
    },
  },
);