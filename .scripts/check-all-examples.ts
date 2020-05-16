import shell from 'shelljs';
import { getAllExampleFolders } from './utils';
import chalk from 'chalk';

export function checkAllExamples() {
  const exampleFolders = getAllExampleFolders();

  for (const exampleFolder of exampleFolders) {
    console.info(chalk.blue(`Checking example: ${exampleFolder}`));
    const success = checkExampleApp(exampleFolder);
    if (!success) {
      process.exit(1);
    }
  }
  console.info(chalk.green(`All examples are checked ✓`));
}

function checkExampleApp(name: string) {
  shell.exec(`cd ${name} && npm ci`, { silent: true, fatal: true });

  let result = shell.exec(`cd ${name} && npm run lint`, { silent: true });
  if (result.code > 0) {
    console.error(chalk.red(`Linting failed for example: ${name}`));
    return false;
  }
  result = shell.exec(`cd ${name} && npm run checkTs`, { silent: true });
  if (result.code > 0) {
    console.error(chalk.red(`Typescript failed for example: ${name}`));
    return false;
  }
  return true;
}

checkAllExamples();
