#!/usr/bin/env node

// LIBs
import { parseCliArguments } from './src/utils/arguments';
import { clone as gitClone } from './src/utils/git';
import { testOutputFiles } from './src/utils/checks';
// Types
import { ArgumentsList } from './src/types/argument';
// Modules
import del from 'del';
import colors from 'colors';
import path from 'path';
import execa from 'execa';
import { Spinner } from 'cli-spinner';
import { existsSync, moveSync } from 'fs-extra';
import { runner as hygen, Logger } from 'hygen';

async function main() {
  process.chdir(__dirname);
  const argumentsList: ArgumentsList = parseCliArguments();

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

  const tmpOutput = `${__dirname}/app`;
  del.sync(tmpOutput, { force: true });
  const generators = argumentsList.generator.split(',');

  console.log(colors.bold(`Found ${generators.length} hygen generators, taking off the plane ✈ ...`));
  for (const generator of generators) {
    await hygen(['generator', generator], {
      templates: path.join(__dirname, templatesPath),
      cwd: tmpOutput,
      logger: new Logger(() => { }),
      createPrompter: () => require('enquirer'),
      exec: async (action, body) => {
        const opts = body && body.length > 0 ? { input: body } : {};
        const spinner = new Spinner(action);
        spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏');
        spinner.start();
        await execa.command(action, { ...opts, shell: true, cwd: tmpOutput });
        spinner.stop(!!'clear');
      },
      debug: !!process.env.DEBUG
    });
  }

  if (!existsSync(tmpOutput)) {
    console.error('This generator did no generated any output files');
    process.exit(1);
  }

  const mvSpinner = new Spinner(`Moving generated files to "${argumentsList.output}"`);
  mvSpinner.setSpinnerString('◴◷◶◵');
  mvSpinner.start();
  moveSync(tmpOutput, argumentsList.output);
  mvSpinner.stop(!!'clear');

  testOutputFiles(generators, argumentsList.output);
}

main();