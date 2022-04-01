[![Tests](https://github.com/Coding-Coach/find-a-mentor/actions/workflows/main.yml/badge.svg)](https://github.com/Coding-Coach/find-a-mentor/actions/workflows/main.yml)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/Coding-Coach/find-a-mentor/issues)
![create-react-app supported](https://img.shields.io/badge/CRA-supported-green.svg)
[![storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)](https://mentors.codingcoach.io/sb/)
[![style: styled-components](https://img.shields.io/badge/style-%F0%9F%92%85%20styled--components-orange.svg?colorB=daa357&colorA=db748e)](https://github.com/styled-components/styled-components)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)


[![Powered By Vercel](https://github.com/Coding-Coach/find-a-mentor/blob/3390fb723a8148c06ea88a7fdb972fd81b5a6064/src/assets/powered-by-vercel.svg)](https://vercel.com/codingcoach?utm_source=coding-coach&utm_campaign=oss)


## Support Us

CodingCoach is a FREE platform that is built and managed entirely by volunteers. As always, there are ongoing costs to run this site such as servers, domains, email, and more.  Please consider becoming a patron so we can continue our mission of being accessible and free ❤️

<a href="https://patreon.com/codingcoach_io"><img src="https://img.shields.io/endpoint.svg?url=https://moshef9.wixsite.com/patreon-badge/_functions/badge/?username=codingcoach_io" alt="Patreon donate button" /> </a>

Pre-release version of Coding Coach.

## Looking for a mentor?

**Please read our [Mentorships Guideline](https://codingcoach.io/guidelines/mentorship-guidelines)**

1. Go to https://mentors.codingcoach.io/
2. Register (or Login)
3. Search for a mentor - use the filters for better matching
4. Find one or more? Hit the "Apply" button in their card
5. Fill the request form
6. Wait for the mentor accept your request (We'll send you an email either if the mentor accepts or declines your request)
7. Contact them using one of their channels

We're aware that some mentors are not active and we are working on ways to keep only the active mentors.
If you didn't receive any response, you can apply to more mentors.
**Don't forget** to let the the other mentors know once you started a mentorship with a different mentor.

## Want to be a mentor?

**Please read our [Mentorships Guideline](https://codingcoach.io/guidelines/mentorship-guidelines)**

1. Go to https://mentors.codingcoach.io/.
1. Register
1. Click on your avatar image and click on `Become a Mentor`.
1. Fill the form with your details and your contact channels.
1. Wait for an approval message (usually it dosn't take more than few hours)


## Requirements

- Git should be installed [Install Git](https://git-scm.com/downloads)
- Nodejs [Install Nodejs](https://nodejs.org/en/download/). **Notice v11.11.0 breaks the tests**
- Yarn (we recommend using yarn as a package manager) [Install Yarn](https://yarnpkg.com/en/)

## Want to contribute to this project?

That's why we're here! 😀

Have an idea? Please **use a branch** and [create a PR](https://help.github.com/articles/creating-a-pull-request/). If you aren't sure how to do this, ask us or find a mentor who can assist.

Don't have time to code it? Please open an [issue](https://github.com/Coding-Coach/find-a-mentor/issues/new).

### Workflow

This section describes the workflow we are going to follow when working on a new feature or fixing a bug. If you want to contribute, please follow these steps:

1. Fork this project
2. Clone the forked project to your local environment, for example: `git clone git@github.com:crysfel/coding-coach-front-end.git` (Make sure to replace the URL with the one to your own repository).
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

#### Storybook

We're using <a target="_blank" href="https://github.com/storybookjs/storybook">Storybook</a>. Each reusable component should be added. If you're not sure 🤷🏾, please ask 🙋

**Production**

https://mentors.codingcoach.io/sb/

**Local**

```
yarn storybook
```

The stories are located under `src/stories`

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

You might have some conflicts while rebasing, try to resolve the conflicts for each individual commit. Rebasing is intimidating at the beginning, if you need help, don't be afraid to reach out in Slack.

## Slack

Coding Coach is on Slack! [Click here](https://join.slack.com/t/coding-coach/shared_invite/zt-15kky1m4x-JrrLzQevCLkdyZiaqT_DTg) to join.

---

This project was created with [Next.js](https://nextjs.org/)

## Available Scripts

In the project directory, you can run:

### `yarn dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner.

### `yarn test:e2e`

Launches the `Cypress` test runner _and_ the app; must run on port `3000`. Learn more about `Cypress` [on their website](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell).

Alternatively You can also use Gitpod ( a free online IDE that will automate your dev setup )  for contributing with a single click. It will launch a ready to code workspace with the dependencies pre-installed so that you can start contributing without wasting precious time on development setup.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/Coding-Coach/find-a-mentor)

# Code of Conduct

At Coding Coach, we value all our mentors, mentees, and contributors. Our goal is to make this a safe space where new and experienced developers can connect and learn from one another. Therefore, we do not tolerate any form of harassment or prejudice. This Code of Conduct applies to all Coding Coach spaces including but not limited to Slack, email correspondence, and social media.

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

Members who violate this code of conduct will be approached by someone of the Coding Coach leadership team and asked to stop immediately. Members may also be banned from the Coding Coach Slack, blocked on social media, and removed from the website.

If someone makes you or anyone else feel unsafe or unwelcome, please report it as soon as possible. To report an incident of harassment, anonymously or otherwise, please fill out our [report form](https://forms.gle/bcSWqNNcsdo3zDD17).

Our primary goal is to support you. We will listen to you and then help you determine a course of action based on the situation. While harassment may not always result in that member being expelled from the group, depending on the type and severity of harassment. We want to make sure you have all the support you need no matter what that entails, including whether to stay anonymous or not. Whatever decision you make, our priority is your safety.

# Support Coding Coach

Our goal is to keep Coding Coach a free platform because we believe that mentorship should be free and accessible for all users. However, there are some costs incurred with creating a platform. We could use your help! If you're just as passionate about Coding Coach as we are, we'd appreciate your support on [Patreon](https://www.patreon.com/codingcoach_io). Here, you can sign up to be a member and help support our mission.
