const { writeFileSync } = require('fs');
// const cp = require('child_process');
const generateLists = require('./generate-lists');

writeFileSync('src/lists.json', JSON.stringify(generateLists()));

// const command = `
// if [[ ! -z $(git status -s) ]]
// then
//   git add src/lists.json
//   git commit -m "[auto] update lists"
//   if [ -n "\${TRAVIS_PULL_REQUEST}" ] && [ "\${TRAVIS_PULL_REQUEST}" != "false" ]
//   then
//     #echo "trying to push to: https://moshfeu:\${github_token}@github.com/\${TRAVIS_PULL_REQUEST_SLUG}.git HEAD:\${TRAVIS_PULL_REQUEST_BRANCH}"
//     git push https://moshfeu:\${github_token}@github.com/\${TRAVIS_PULL_REQUEST_SLUG}.git HEAD:\${TRAVIS_PULL_REQUEST_BRANCH}
//   else
//     git reset HEAD~
//     echo "no travis PR"
//   fi
// else
//   echo "tree is clean"
// fi
// `;
// try {
//   const result = cp.execSync(command, {
//     shell: '/bin/bash'
//   });
//   console.log('==================');
//   console.log(result.toString())
//   console.log('==================');
// } catch (error) {
//   console.error(error);
// }
