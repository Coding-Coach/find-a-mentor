const {promisify} = require('util');
const fs = require('fs');
const path = require('path');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const absolutePath = path.join(__dirname, '../src', 'mentors.json');

const execa = require('execa');
const Ora = require('ora');

const createUser = require('./create-user');

const spinnerMerge = new Ora({
  text: 'Adding to mentors list'
})
const spinnerGit = new Ora({
  text: 'Adding to Git'
});

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

async function gitJob(name) {
  const commitMessage = `add ${name} as mentor`
  await execa('git', ['add', '.']);
  await execa('git', ['commit', '-m', commitMessage]);
}

(async () => {
    const answers = await createUser();
    const name = answers.name;

    spinnerMerge.start();
    try {
      await addToMentorsList(answers);
      spinnerMerge.succeed()
    } catch (error) {
      spinnerMerge.fail();
      console.error('Error: ', error.message);
      return false;
    }

    spinnerGit.start();
    try {
      await gitJob(name);
      spinnerGit.succeed();
    } catch (error) {
      spinnerGit.fail();
      console.error('Error: ', error.message);
      return false;
    }

    console.log('Mentor added. Please now do a git push and create a PR for finish the process. Thanks!');
})()
