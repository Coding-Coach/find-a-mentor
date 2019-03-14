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
})
const spinnerCommit = new Ora({
  text: 'Adding to Git'
});
const spinnerPush = new Ora({
  text: 'Publishing to Github'
})

async function gitPull() {
  await execa('git', ['pull']);
}

async function addToMentorsList(mentor) {
  try {
    const text = await readFileAsync(absolutePath, {encoding: 'utf8'});
    const data = JSON.parse(text);
    data.push(mentor);
    const mentors = JSON.stringify(data, null, 2) + '\n';
    await writeFileAsync(absolutePath, mentors);
    return true;
  } catch (error) {
    throw new Error(error);
  }
}

async function gitCommit(name) {
  const commitMessage = `add ${name} as mentor`
  await execa('git', ['add', '.']);
  await execa('git', ['commit', '-m', commitMessage]);
}

async function gitPush(name) {
  const branchName = `add-${name}-as-mentor`
  await execa('git', ['checkout','-b', branchName]);
  await execa('git', ['push']);
}

(async () => {
  spinnerPull.start();
  try {
    await gitPull();
    spinnerPull.succeed()
  } catch (error) {
    spinnerPull.fail();
    console.error('Error: ', error.message);
    return false;
  }

  const answers = await createUser();

  spinnerMerge.start();
  try {
    await addToMentorsList(answers.name);
    spinnerMerge.succeed()
  } catch (error) {
    spinnerMerge.fail();
    console.error('Error: ', error.message);
    return false;
  }

  spinnerCommit.start();
  try {
    await gitCommit(answers.name);
    spinnerCommit.succeed();
  } catch (error) {
    spinnerCommit.fail();
    console.error('Error: ', error.message);
    return false;
  }

  spinnerPush.start();
  try {
    await gitPush(answers.name);
    spinnerPush.succeed();
  } catch (error) {
    spinnerPush.fail();
    console.error('Error: ', error.message);
    return false;
  }

  console.log('Mentor added. Please now do a git push and create a PR for finish the process. Thanks!');
})()
