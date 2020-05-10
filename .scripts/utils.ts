import fs from 'fs';
import path from 'path';

export function parseArgv(argv: string[], key: string, existsOnly?: boolean) {
  const index = argv.indexOf(`--${key}`);
  if (index > 0) {
    if (existsOnly) {
      return true;
    }
    return argv[index + 1];
  }
  return undefined;
}

export function folderExists(name: string) {
  const folders = fs.readdirSync(path.join(__dirname, '../'));
  return folders.indexOf(name) >= 0;
}

export function getAllExampleFolders() {
  const rootPath = path.join(__dirname, '../');
  const folders = fs.readdirSync(rootPath);
  const examples = [];
  for (const folder of folders) {
    const folderPAth = path.join(rootPath, folder);
    const packageJsonFile = path.join(folderPAth, 'package.json');
    if (
      fs.statSync(folderPAth).isDirectory() &&
      fs.existsSync(packageJsonFile)
    ) {
      examples.push(folder);
    }
  }
  return examples;
}
