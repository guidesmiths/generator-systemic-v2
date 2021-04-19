// Modules
import yargs from 'yargs';
import { get } from 'lodash';
import { readFileSync } from 'fs-extra';
// Types
import { Arguments as YargsArguments } from 'yargs';
import { ArgumentsList } from '../types/argument';
import { PathLike } from 'node:fs';

function parseCliArgumentsToList(yargsArguments: YargsArguments): ArgumentsList {
  return {
    url: get(yargsArguments, 'url') as string,
    generator: get(yargsArguments, 'generator') as string,
    output: get(yargsArguments, 'output') as string,
    username: get(yargsArguments, 'username') as string,
    credentials: get(yargsArguments, 'credentials') as string,
    publicKey: readFileSync(get(yargsArguments, 'public-key') as PathLike).toString(),
    privateKey: readFileSync(get(yargsArguments, 'private-key') as PathLike).toString()
  };
};

export function parseCliArguments(): ArgumentsList {
  const yargsArguments: YargsArguments = yargs
    .command('template', 'Template command')
    .options({
      'url': {
        description: 'the template git repository url',
        require: true,
        string: true
      },
      'generator': {
        description: 'the template generator',
        require: true,
        string: true
      },
      'output': {
        description: 'the template generator output files',
        require: true,
        string: true
      },
    })
    .command('git', 'Git command')
    .options({
      'username': {
        description: 'git username',
        require: false,
        string: true,
        default: 'git'
      },
      'credentials': {
        description: 'git username credentials',
        require: false,
        string: true,
        default: ''
      },
      'public-key': {
        description: 'git user public key',
        require: true,
        string: true
      },
      'private-key': {
        description: 'git user provate key',
        require: true,
        string: true
      }
    })
    .help()
    .alias('help', 'h')
    .argv

  return parseCliArgumentsToList(yargsArguments);
};
