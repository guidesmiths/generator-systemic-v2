# gs-hygen

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js v14 or higher is required.

Installation is done using the
[`npm install`](https://docs.npmjs.com/getting-started/installing-npm-packages-locally) command:

```bash
$ npm install -g gs-hygen
```

## Install from git repository

```bash
git clone https://github.com/guidesmiths/gs-hygen
npm install --quiet
npm pack
npm i -g gs-hygen-*.tgz
gs-hygen --help
```

## Usage examples

```bash
gs-hygen \
  template \
    --url git@github.com:guidesmiths/infinitas-hygen-template-generators.git \
    --generator service-systemic-basics,nvm,commitlint,jest-systemic,jest-systemic-mock-bus \
    --output /tmp/generator-demo-repo \
  git \
    --private-key ~/.ssh/id_rsa \
    --public-key ~/.ssh/id_rsa.pub
```

## CLI options

### Getting help
```
gs-hygen --help
```
```
gs-hygen [command]

Commands:
  gs-hygen template  Template command
  gs-hygen git       Git command

Options:
      --version      Show version number                               [boolean]
      --url          the template git repository url      [string] [default: ""]
      --generator    the template generators, example: "docker,git,eslint"
                                                                        [string]
      --output       the template generator output files     [string] [required]
      --username     git username                      [string] [default: "git"]
      --credentials  git username credentials             [string] [default: ""]
      --public-key   git user public key                  [string] [default: ""]
      --private-key  git user provate key                 [string] [default: ""]
  -h, --help         Show help                                         [boolean]
```

### Optional parameters

You can also choose the generators manually avoiding to provide the `--generator` argument, the output will look like this:

![image](https://user-images.githubusercontent.com/16175933/145254497-bf6f27f6-62d9-4079-bb7e-a9865f356d11.png)


## Creating templates

This project only supports templates for <a href="https://www.npmjs.com/package/hygen">hygen</a>.
<br />
So what we need is to generate a new project with the hygen templates section already generated.

```bash
mkdir new-templates
cd new-templates
git init -b main
mkdir generator _shared
# Visit the hygen docs for generating some basic hygen generator
# http://www.hygen.io/docs/quick-start
git add .
git commit -m "New template generators"
git remote add origin <REMOTE_URL>
git push origin main
```

This templates project <a href="https://github.com/guidesmiths/infinitas-hygen-template-generators">repo</a> is a good starting point
