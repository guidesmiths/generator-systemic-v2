// Modules
import yargs from 'yargs';
import del from 'del';
import Git from 'nodegit';
import { get } from 'lodash';
import { readFileSync, existsSync } from 'fs';

async function start() {
  const templateCommand = yargs
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
      }
    })
    .help()
    .alias('help', 'h')
    .argv;

  const templateArgvs = {
    url: get(templateCommand, 'url'),
    generator: get(templateCommand, 'generator')
  };

  const gitCommand = yargs
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
    .argv;

  const gitArgvs = {
    username: get(gitCommand, 'username'),
    credentials: get(gitCommand, 'credentials'),
    publicKey: readFileSync(get(gitCommand, 'public-key')).toString(),
    privateKey: readFileSync(get(gitCommand, 'private-key')).toString()
  };

  const templatesPath = '_templates_';
  if (existsSync(templatesPath)) {
    del.sync(templatesPath, { force: true });
  }

  await Git.Clone.clone(templateArgvs.url, templatesPath, {
    fetchOpts: {
      callbacks: {
        credentials: async () => Git.Cred.sshKeyMemoryNew(
          gitArgvs.username, gitArgvs.publicKey,
          gitArgvs.privateKey, gitArgvs.credentials
        )
      }
    }
  });



  console.log(templateArgvs)
}

start();