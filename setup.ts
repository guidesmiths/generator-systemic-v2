#!/usr/bin/env node

// LIBs
import { parseCliArguments } from './src/utils/arguments';
import { clone as gitClone } from './src/utils/git';
import { version as checkVersion, testOutputFiles } from './src/utils/cheks';
// Types
import { ArgumentsList } from './src/types/argument';
// Modules
import del from 'del';
import colors from 'colors';
import { spawnSync } from 'child_process';
import { existsSync, moveSync } from 'fs-extra';

async function main() {
  const argumentsList: ArgumentsList = parseCliArguments();
  checkVersion();

  const templatesPath = `_templates/`;
  if (existsSync(templatesPath)) {
    del.sync(templatesPath, { force: true });
  }

  if (existsSync(argumentsList.output)) {
    del.sync(argumentsList.output, { force: true })
  }

  await gitClone({
    url: argumentsList.url,
    destination: templatesPath,
    username: argumentsList.username,
    publicKey: argumentsList.publicKey,
    privateKey: argumentsList.privateKey,
    credentials: argumentsList.credentials,
  });

  const tmpOutput = 'app'
  del.sync(tmpOutput, { force: true });
  const generators = argumentsList.generator.split(',');

  console.log(colors.bold(`Found ${generators.length} hygen generators, taking off the plane 🛨 ...`));
  for (const generator of generators) {
    const command = ['hygen', 'generator', generator];
    console.log(colors.blue(`\nRunning ${generator} ...`));
    spawnSync('npx', command, { stdio: 'inherit' })
  }

  if (!existsSync(tmpOutput)) {
    console.error('This generator did no generated any output files');
    process.exit(1);
  }

  moveSync(tmpOutput, argumentsList.output);
  testOutputFiles(generators, argumentsList.output);
}

main();