[![Build Status](https://travis-ci.com/Coding-Coach/find-a-mentor.svg?branch=master)](https://travis-ci.com/Coding-Coach/find-a-mentor)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/Coding-Coach/find-a-mentor/issues)

Pre-release version of Coding Coach.

## Looking for a mentor?

Just go to https://mentors.codingcoach.io/ and find her / him / them.

## Requirements
- Git should be installed [Install Git](https://git-scm.com/downloads)
- Nodejs [Install Nodejs](https://nodejs.org/en/download/). **Notice v11.11.0 breaks the tests**
- Yarn (we recommend using yarn as a package manager) [Install Yarn](https://yarnpkg.com/en/)

## Want to be a mentor?

1. Fork
1. `yarn` (make sure you have a compatible node version, [nvm](https://github.com/creationix/nvm) or [fnm](https://github.com/Schniz/fnm#installation) can help here)

### CLI Geek?

![Add user - demo](docs-assets/demo-add-user.gif)

1. `yarn run add-user`
1. Answer the questions.
1. Step 2 will push the required changes to a branch `add-{your-name}-as-mentor` so you just need to create a PR.

### Like to do it manually?
1. **Create a branch** "add-{your-name}-as-mentor"
1. Add your details in `src/mentors.json` file (check the below schema for requirements).
1. Run `yarn test` to validate that the details is following the right schema (carelfully read the output to see what needs to be fixed)
1. Push the "add-{your-name}-as-mentor" branch to github
1. PR with the title "Add {Your Name} as mentor".
1. Thanks!

**Notes:**

1. Please double check your details. It’s important that the data scheme remains the same; just replace the details with your values. If you change the data architecture, it will cause errors.
2. In order to avoid merge conflicts, please fetch the changes on master before pushing.

### Mentor schema

```javascript
{
  "id": "your email",
  "name": "your name",                          // minLength: 2
  "avatar": "https://link-to-your/avatar.jpg",  // url, must start with https://
  "title": "NodeJS developer",                  // minLength: 2, maxLength: 30
  "description": "Hi, I'm NodeJs developer",    // minLength: 5, maxLength: 80 optional
  "country": "SE",                              // Country code (link to the list below)
  "tags": [                                     // minItems: 1, maxItems: 5
    "nodejs", "webpack", "mongodb"              // please avoid synonyms (see list below)
  ],
  "channels": [                                 // minItems: 1, maxItems: 3
    {
      "type": "email",                          // see available channels below
      "id": "john@gmail.com"                    // depends on the type
    }
  ]
}
```

#### synonyms tags

| Use          | Don't use     |
|--------------|---------------|
| nodejs       | node, node.js |
| reactjs      | react         |
| react native | react-native  |
| c#           | csharp        |
| frontend     | front end     |

#### Country codes

https://github.com/hjnilsson/country-flags/blob/master/countries.json

#### Channels

| type     | parameter                                                                                                               |
|----------|-------------------------------------------------------------------------------------------------------------------------|
| email    | email address                                                                                                           |
| slack    | memberID ([How to find it?](https://medium.com/@moshfeu/how-to-find-my-member-id-in-slack-workspace-d4bba942e38c#88b8)) |
| linkedin | userId                                                                                                                  |
| facebook | userId                                                                                                                  |
| twitter  | userId                                                                                                                  |
| github   | userId                                                                                                                  |
| website  | link to your personal website without https                                                                             |

## Want to contribute this project?

That's why we here! 😀

Have an idea? Please **use a branch** and [create a PR](https://help.github.com/articles/creating-a-pull-request/). If you not sure how to do this, ask us or find a mentor who can assist.

Haven't time to code it? Please open an [issue](https://github.com/Coding-Coach/find-a-mentor/issues/new).

## Slack

Coding Coach is on Slack! [Click here](https://coding-coach.slack.com/join/shared_invite/enQtNDYxNTcwMjk4MDcwLThiZjY1MTM2YTU1YzM2MGI1N2Y1NDI3ZGM1MGRhNjdiZjU0MzE1YjMxZjdlZmVlNDdhNmFhN2RhNGIxZmE1YTI) to join.

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

# Code of Conduct
Code of Conduct

At Coding Coach, we value all our mentors, mentees, and contributors. Our goal is to make this a safe space where new and experienced developers can connect and learn from one another. Therefore, we do not tolerate any form of harassment or prejudice. This Code of Conduct applies to all Coding Coach spaces including but not limited to slack, email correspondence, and social media.

Harassment includes but is not limited to:
- Offensive comments related to gender, gender identity and expression, sexual orientation, disability, mental illness, physical appearance, body size, age, race, or religion.
- Deliberate misgendering or use of ‘dead’ or rejected names.
- Physical contact and simulated physical contact (eg, textual descriptions like “hug” or “backrub”) without consent or after a request to stop.
- Threats of violence.
- Incitement of violence towards any individual, including encouraging a person to commit suicide or to engage in self-harm.
- Deliberate intimidation.
- Stalking or following.
- Harassing photography or recording, including logging online activity for harassment purposes.
- Unwelcome sexual attention such as sexual images or behaviour in spaces where they’re not appropriate.
- Pattern of inappropriate social contact, such as requesting/assuming inappropriate levels of intimacy with others
- Continued one-on-one communication after requests to cease.
- Deliberate “outing” of any aspect of a person’s identity without their consent except as necessary to protect vulnerable people from intentional abuse.
- Publication of non-harassing private communication.

We value integrity here at Coding Coach. As such, mentees may not ask for solutions to technical interview take home assessments. We're happy to mentor you in the process of solving difficult questions, but will not provide you with solutions to your assessments as they are meant to reflect your personal skillset.

Members who violate this code of conduct will be approached by someone of the Coding Coach leadership team and asked to stop immediately. Members may also be banned from the Coding Coach slack, blocked on social media, and removed from the website.

If someone makes you or anyone else feel unsafe or unwelcome, please report it as soon as possible. To report an incident of harassment, anonymously or otherwise, please fill out our [report form](https://forms.gle/bcSWqNNcsdo3zDD17).

Our primary goal is to support you. We will listen to you and then help you determine a course of action based on the situation. While harassment may not always result in that member being expelled from the group, depending on the type and severity of harassment. We want to make sure you have all the support you need no matter what that entails, including whether to stay anonymous or not. Whatever decision you make, our priority is your safety. 
