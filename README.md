[![Build Status](https://travis-ci.com/Coding-Coach/find-a-mentor.svg?branch=master)](https://travis-ci.com/Coding-Coach/find-a-mentor)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/Coding-Coach/find-a-mentor/issues)

<a href="https://patreon.com/codingcoach_io"><img src="https://img.shields.io/endpoint.svg?url=https://shieldsio-patreon.herokuapp.com/codingcoach_io&style=for-the-badge" alt="Patreon donate button" /> </a>

Pre-release version of Coding Coach.

## Looking for a mentor?

**Please read our [Mentorships Guideline](https://docs.google.com/document/d/1zKCxmIh0Sd4aWLiQncICOGm6uf38S0kJ0xb0qErNFVA/edit?ts=5dc96ff1)**

1. Go to https://mentors.codingcoach.io/
1. Search for a mentor - use the filters for better matching
1. Find one or more? Register to get their details.
1. Reach them out.

## Want to be a mentor?

**Please read our [Mentorships Guideline](https://docs.google.com/document/d/1zKCxmIh0Sd4aWLiQncICOGm6uf38S0kJ0xb0qErNFVA/edit?ts=5dc96ff1)**

1. Go to https://mentors.codingcoach.io/.
1. Register
1. Click on your avatar image and click on `Become a Mentor`.
1. Fill the form with your details and your contact channels.
1. Wait for an approval message (usually it dosn't take more than few hours)


## Requirements

- Git should be installed [Install Git](https://git-scm.com/downloads)
- Nodejs [Install Nodejs](https://nodejs.org/en/download/). **Notice v11.11.0 breaks the tests**
- Yarn (we recommend using yarn as a package manager) [Install Yarn](https://yarnpkg.com/en/)

## Want to contribute this project?

That's why we here! 😀

Have an idea? Please **use a branch** and [create a PR](https://help.github.com/articles/creating-a-pull-request/). If you not sure how to do this, ask us or find a mentor who can assist.

Haven't time to code it? Please open an [issue](https://github.com/Coding-Coach/find-a-mentor/issues/new).

### Workflow

This section describes the workflow we are going to follow when working in a new feature or fixing a bug. If you want to contribute, please follow these steps:

1. Fork this project
2. Clone the forked project to your local environment, for example: `git clone git@github.com:crysfel/coding-coach-front-end.git` (Make sure to replace the URL to your own repository).
3. Add the original project as a remote, for this example the name is `upstream`, feel free to use whatever name you want. `git remote add upstream https://github.com/Coding-Coach/find-a-mentor.git`.

Forking the project will create a copy of that project in your own GitHub account, you will commit your work against your own repository.

#### Quick start

1. Navigate to the project folder.
2. Run `yarn`
3. Run `yarn test`
4. Type `a` to run all tests
5. Type `q` to quit (this will start cypress and set that up)
6. If the browser doesn't open automatically, navigate to [http://localhost:3000](http://localhost:3000) to see the site.

For other options, please see [Available Scripts](https://github.com/Coding-Coach/find-a-mentor#available-scripts) below.

#### Updating your local

In order to update your local environment to the latest version on `master`, you will have to pull the changes using the `upstream` repository, for example: `git pull upstream master`. This will pull all the new commits from the origin repository to your local environment.

#### Features/Bugs

When working on a new feature, create a new branch `feature/something` from the `master` branch, for example `feature/login-form`. Commit your work against this new branch and push everything to your forked project. Once everything is completed, you should create a PR to the original project. Make sure to add a description about your work.

When fixing a bug, create a new branch `fix/something` from the `master` branch, for example `fix/css-btn-issues`. When completed, push your commits to your forked repository and create a PR from there. Please make sure to describe what was the problem and how did you fix it.

#### Updating your local branch

Let's say you've been working on a feature for a couple days, most likely there are new changes in `master` and your branch is behind. In order to update it to the latest (You might not need/want to do this) you need to pull the latest changes to `master` and then rebase your current branch.

```bash
$ git checkout master
$ git pull upstream master
$ git checkout feature/something-awesome
$ git rebase master
```

After this, your commits will be on top of the `master` commits. From here you can push to your `origin` repository and create a PR.

You might have some conflicts while rebasing, try to resolve the conflicts for each individual commit. Rebasing is intimidating at the beginning, if you need help don't be afraid to reach out in slack.

## Slack

Coding Coach is on Slack! [Click here](https://join.slack.com/t/coding-coach/shared_invite/enQtNDYxNTcwMjk4MDcwLWQ2MWEwYTc3YTZmMmM5ZDJjOGRkMDg0NGRjOWJhZThlZjUyMmViYzM4YjY4MjFjZGJkNjAzNDVlYTEwMWY2ZTU) to join.

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

### `yarn test:e2e`

Launches the `Cypress` test runner _and_ the app; must run on port `3000`. Learn more about `Cypress` [on their website](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell).

Alternatively You can also use Gitpod ( a free online IDE that will automate your dev setup )  for contributing with a single click. It will launch a ready to code workspace with the dependencies pre-installed so that you can start contributing without wasting precious time on development setup.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/Coding-Coach/find-a-mentor)

# Code of Conduct

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

We value integrity here at Coding Coach. As such, mentees may not ask for solutions to technical interview take home assessments. We're happy to mentor you in the process of solving difficult questions, but will not provide you with solutions to your assessments as they are meant to reflect your personal skill set.

Members who violate this code of conduct will be approached by someone of the Coding Coach leadership team and asked to stop immediately. Members may also be banned from the Coding Coach slack, blocked on social media, and removed from the website.

If someone makes you or anyone else feel unsafe or unwelcome, please report it as soon as possible. To report an incident of harassment, anonymously or otherwise, please fill out our [report form](https://forms.gle/bcSWqNNcsdo3zDD17).

Our primary goal is to support you. We will listen to you and then help you determine a course of action based on the situation. While harassment may not always result in that member being expelled from the group, depending on the type and severity of harassment. We want to make sure you have all the support you need no matter what that entails, including whether to stay anonymous or not. Whatever decision you make, our priority is your safety.

# Support Coding Coach

Our goal is to keep Coding Coach a free platform because we believe that mentorship should be free and accessible for all users. However, there are some costs incurred with creating a platform. We could use your help! If you're just as passionate about Coding Coach as we are, we'd appreciate your support on [Patreon](https://www.patreon.com/codingcoach_io). Here, you can sign up to be a member and help support our mission.
