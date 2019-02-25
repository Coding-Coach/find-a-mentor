[![Build Status](https://travis-ci.com/Coding-Coach/find-a-mentor.svg?branch=master)](https://travis-ci.com/Coding-Coach/find-a-mentor)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/Coding-Coach/find-a-mentor/issues)

Pre-release version of Coaching Code.

## Looking for a mentor?

Just go to https://mentors.codingcoach.io/ and find her / him.

## Want to be a mentor?

1. Fork
2. `yarn`
3. Add your details in `mentors.json` file.
5. Run `npm test` to validate that the details is following the right schema.
6. PR.
7. Thanks!

**By the way** You can either do all these steps [using Github UI](https://help.github.com/articles/editing-files-in-another-user-s-repository/). Don't worry, trvis-ci will run the tests for you on the PR.

### Mentor schema

```javascript
{
  "id": "your email",
  "name": "your name",                          // minLength: 2
  "avatar": "https://link-to-your/avatar.jpg",  // url
  "title": "NodeJS developer",                  // minLength: 2
  "description": "Hi, I'm NodeJs developer",    // minLength: 5, maxLength: 80 optional
  "country": "Israel",                          // should be real :)
  "tags": [                                     // minItems: 1, maxItems: 5
    "nodejs", "webpack", "mongodb"
  ],
  "channels": [
    {
      "type": "email",                          // see available channels below
      "id": "john@gmail.com"                    // depends on the type
    }
  ]
}
```

#### Channels

| type     | parameter                         |
|----------|-----------------------------------|
| email    | email address                     |
| slack    | slackId in coding-coach workspace |
| linkedin | userId                            |
| facebook | userId                            |
| twitter  | userId                            |

## Want to contribute this project?

That's why we here! 😀

Have an idea? Please [create a PR](https://help.github.com/articles/creating-a-pull-request/). If you not sure how to do this, ask us or find a mentor who can assist.

Haven't time to code it? Please open an [issue](https://github.com/Coding-Coach/find-a-mentor/issues/new).


---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
