import shell from 'shelljs';
import chalk from 'chalk';
import { folderExists } from './utils';
import replace from 'replace-in-file';
import fs from 'fs';

export function createExampleApp(name: string) {
  const folderName = `example_${name}`;
  console.info(chalk.green(`Creating '${folderName}'...`));
  shell.exec(`create-react-app --template cra-template-rb ${folderName}`, {
    silent: false,
    fatal: true,
  });
  shell.exec(`cd ${folderName} && npm run cleanExampleApp`, { fatal: true });
  shell.cp('-f', './.scripts/templates/README.md', `${folderName}/README.md`);

  fixHuskyBug();

  console.info(
    chalk.green(`You can go into your folder and code your example now 💪`),
  );
}

function fixHuskyBug() {
  // husky changes directory to the example folder which we don't want
  const huskyLocalPath = '.git/hooks/husky.local.sh';
  if (!fs.existsSync(huskyLocalPath)) {
    return;
  }
  const options = {
    files: '.git/hooks/husky.local.sh',
    from: /cd.*/g,
    to: `cd "."`,
  };
  try {
    replace.sync(options);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

const name = process.argv[2] || '';
if (name.length <= 0) {
  console.log(chalk.red('Specify name for the example application'));
  console.log(chalk.blue('for example: `npm run create my-example`'));
  process.exit(1);
}
if (folderExists(name)) {
  console.log(chalk.red('Folder already exists'));
  process.exit(1);
}

createExampleApp(name);
