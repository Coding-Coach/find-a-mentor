// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

const { stat } = require('fs');

// The current database to use.
use('codingcoach');

// Create a new document in the collection.
db.getCollection('applications').find({status: 'Pending'});