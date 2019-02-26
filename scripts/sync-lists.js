const { writeFileSync } = require('fs');
const cp = require('child_process');

function generateLists() {
  const mentors = require('../src/mentors.json');
  const json = {
    tags: [],
    countries: [],
  }

  for (let i = 0; i < mentors.length; i++) {
    json.tags.push(...(mentors[i].tags || []));
    json.countries.push(mentors[i].country);
  }

  json.tags = [...new Set(json.tags)]
  json.countries = [...new Set(json.countries)]

  return json;
}

writeFileSync('src/lists.json', JSON.stringify(generateLists()));

const command = `
if [[ ! -z $(git status -s) ]]
then
  git add src/lists.json
  git commit -m "[auto] update lists"
  if [ -n "\${TRAVIS_PULL_REQUEST}" ] && [ "\${TRAVIS_PULL_REQUEST}" != "false" ]
  then
    echo "trying to push to: \${TRAVIS_BRANCH} \${TRAVIS_PULL_REQUEST_BRANCH} \${TRAVIS_PULL_REQUEST_SLUG} branch"
  else
    git reset HEAD~
    echo "no travis PR"
  fi
else
  echo "tree is clean"
fi
`;
try {
  const result = cp.execSync(command, {
    shell: '/bin/bash'
  });
  console.log('==================');
  console.log(result.toString())
  console.log('==================');
} catch (error) {
  console.error(error);
}

module.exports = generateLists;
