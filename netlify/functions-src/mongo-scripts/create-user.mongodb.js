// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('codingcoach');

// Create a new document in the collection.
db.getCollection('users').insertOne({
  auth0Id: 'auth0|123456789',
  email: 'user@example.com',
  available: true,
  name: 'John Doe',
  avatar: 'avatar.png',
  image: {
    fieldname: 'avatar',
    originalname: 'avatar.png',
    encoding: '7bit',
    mimetype: 'image/png',
    destination: '/uploads/',
    filename: 'avatar.png',
    path: '/uploads/avatar.png',
    size: 12345,
  },
  title: 'Software Engineer',
  description: 'Experienced software engineer with expertise in web development.',
  country: 'US',
  spokenLanguages: ['en', 'es'],
  tags: ['JavaScript', 'Node.js', 'MongoDB'],
  roles: ['Mentor'],
  channels: [
    {
      type: 'email',
      id: 'user@example.com',
    },
  ],
});
