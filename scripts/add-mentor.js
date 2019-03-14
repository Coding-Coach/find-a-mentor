const {promisify} = require('util');
const fs = require('fs');
const path = require('path');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const absolutePath = path.join(__dirname, '../src', 'mentors.json');

const execa = require('execa');
const Ora = require('ora');

const createUser = require('./create-user');

const spinnerPull = new Ora({
  text: 'Getting the last changes'
});
const spinnerMerge = new Ora({
  text: 'Adding to mentors list'
});
const spinnerBranch = new Ora({
  text: 'Creating branch'
});
const spinnerCommit = new Ora({
  text: 'Adding to Git'
});
const spinnerPush = new Ora({
  text: 'Publishing to Github'
})

async function gitPull() {
  await execa('git', ['pull']);
}

async function gitBranch(name) {
  await execa('git', ['checkout','-b', `add-${name}-as-mentor`]);
}

async function gitCommit(name) {
  await execa('git', ['add', '.']);
  await execa('git', ['commit', '-m', `add ${name} as mentor`]);
}

async function gitPush(name) {
  await execa('git', ['push', '--set-upstream', 'origin', `add-${name}-as-mentor`]);
}

const gitFunctions = {
  pullProcess: async () => {
    spinnerPull.start();
    try {
      await gitPull();
      spinnerPull.succeed()
    } catch (error) {
      spinnerPull.fail();
      console.error('Error: ', error.message);
      return false;
    }
  },
  branchProcess: async() => {
    spinnerBranch.start();
    try {
      await gitBranch(answers.name);
      spinnerBranch.succeed();
    } catch (error) {
      spinnerBranch.fail();
      console.error('Error: ', error.message);
      return false;
    }
  },
  commitProcess: async() => {
    spinnerCommit.start();
    try {
      await gitCommit(answers.name);
      spinnerCommit.succeed();
    } catch (error) {
      spinnerCommit.fail();
      console.error('Error: ', error.message);
      return false;
    }
  },
  pushProcess: async() => {
    spinnerPush.start();
    try {
      await gitPush(answers.name.toLowerCase().replace(/\s/g, '-'));
      spinnerPush.succeed();
    } catch (error) {
      spinnerPush.fail();
      console.error('Error: ', error.message);
      return false;
    }
  }
};

async function addToMentorsList(mentor) {
  spinnerMerge.start();
  try {
    const text = await readFileAsync(absolutePath, {encoding: 'utf8'});
    const data = JSON.parse(text);
    data.push(mentor);
    const mentors = JSON.stringify(data, null, 2) + '\n';
    await writeFileAsync(absolutePath, mentors);
    spinnerMerge.succeed();
  } catch (error) {
    spinnerMerge.fail();
    console.error('Error: ', error.message);
    return false;
  }
}

(async () => {

  await gitFunctions.pullProcess();
  const answers = await createUser();
  await addToMentorsList(answers);
  await gitFunctions.branchProcess();
  await gitFunctions.commitProcess();
  await gitFunctions.pushProcess();

  console.log('\nMentor added.Please now create a PR for finish the process. Thanks!');
})()
