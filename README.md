# generator-systemic-v2

## Install from repository
```bash
git clone https://github.com/bounteous/generator-systemic-v2
npm install --quiet
npm pack
npm i -g generator-systemic-v2-1.0.0.tgz
generator-systemic-v2 --help
```

## Usage examples

```bash
generator-systemic-v2 \
template --url git@github.com:bounteous/infinitas-hygen-template-generators.git --generator nvm,docker-node-lts --output /tmp/generator-demo-repo \
git --private-key ~/.ssh/id_rsa --public-key ~/.ssh/id_rsa.pub
```

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

This templates project <a href="https://github.com/bounteous/infinitas-hygen-template-generators">repo</a> is a good starting point